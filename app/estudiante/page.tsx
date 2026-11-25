'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StudentPanel() {
  const supabase = createClient();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [internships, setInternships] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [onlyMyCareer, setOnlyMyCareer] = useState(true);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'ok'; text: string } | null>(null);

  // Estados de los documentos obligatorios para postular
  const [correoDirector, setCorreoDirector] = useState('');
  const [certAlumnoRegular, setCertAlumnoRegular] = useState<File | null>(null);
  const [certNotas, setCertNotas] = useState<File | null>(null);
  const [modalError, setModalError] = useState('');

  const loadStudentData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/');
      return;
    }

    const { data: prof } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    setProfile(
      prof || {
        id: user.id,
        full_name: user.email?.split('@')[0] || 'Estudiante',
        rut: 'Sin RUT',
        email: user.email,
        university: 'Universidad no especificada',
        career: 'Ingeniería Civil en Computación / Informática',
      }
    );

    const { data: offers } = await supabase
      .from('internships')
      .select('*, companies!inner(razon_social, rut_empresa, correo_contacto, status)')
      .eq('companies.status', 'approved')
      .eq('activa', true)
      .order('created_at', { ascending: false });
    setInternships(offers || []);

    const { data: myApps } = await supabase
      .from('applications')
      .select('*, internships(titulo, modalidad, tipo_practica, companies(razon_social, rut_empresa))')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false });
    setApplications(myApps || []);
  };

  useEffect(() => {
    loadStudentData();
  }, []);

  const openApplicationModal = (offer: any) => {
    setSelectedOffer(offer);
    setCorreoDirector('');
    setCertAlumnoRegular(null);
    setCertNotas(null);
    setModalError('');
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    setModalError('');
    const file = e.target.files?.[0] || null;
    if (!file) {
      setter(null);
      return;
    }
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setModalError('Solo se permiten archivos en formato PDF (.pdf).');
      e.target.value = '';
      setter(null);
      return;
    }
    setter(file);
  };

  const buildCartaText = (offer: any) => {
    if (!profile || !offer) return '';
    return `Estimado/a Supervisor/a de ${offer.companies?.razon_social} (${offer.companies?.correo_contacto}):

Por medio de la presente, la institución ${profile.university} certifica que nuestro/a estudiante ${profile.full_name} (RUT: ${profile.rut}), perteneciente a la carrera de ${profile.career}, cumple con matrícula activa y se encuentra habilitado/a académicamente para postular y cursar su Práctica Profesional ${offer.tipo_practica} en el cargo "${offer.titulo}" en vuestra organización (RUT: ${offer.companies?.rut_empresa}).

Contacto Dirección de Carrera para validación académica: ${correoDirector || '[Ingresa correo del Director de Carrera]'}

Se adjuntan Certificado de Alumno Regular y Certificado de Notas vigentes en formato PDF. Quedamos a su entera disposición para coordinar la cobertura de seguro escolar Ley N° 16.744 requerida.

Atentamente,
Coordinación de Prácticas Profesionales
${profile.university}`;
  };

  const uploadPdfDocument = async (file: File, prefix: string): Promise<string> => {
    const fileName = `${profile.id}/${prefix}-${Date.now()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('documentos-estudiantes')
      .upload(fileName, file, { contentType: 'application/pdf' });

    if (uploadError) {
      throw new Error(`Error subiendo ${prefix}: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from('documentos-estudiantes')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleApplyWithLetter = async () => {
    if (!profile || !selectedOffer) return;
    setModalError('');
    setFeedback(null);

    if (applications.length >= 3) {
      setModalError('Ya alcanzaste el límite máximo de 3 postulaciones.');
      return;
    }

    if (!correoDirector.trim() || !/\S+@\S+\.\S+/.test(correoDirector.trim())) {
      setModalError('Debes ingresar un correo válido del Director de Carrera.');
      return;
    }

    if (!certAlumnoRegular || !certNotas) {
      setModalError('Debes adjuntar ambos documentos en formato PDF (Alumno Regular y Notas).');
      return;
    }

    const isCompatible =
      !selectedOffer.carreras_admitidas?.length ||
      selectedOffer.carreras_admitidas.includes(profile.career);

    if (!isCompatible) {
      setModalError('Tu carrera no está habilitada para esta práctica.');
      return;
    }

    setSubmitting(true);
    try {
      const [alumnoRegularUrl, notasUrl] = await Promise.all([
        uploadPdfDocument(certAlumnoRegular, 'alumno-regular'),
        uploadPdfDocument(certNotas, 'certificado-notas'),
      ]);

      const cartaTexto = buildCartaText(selectedOffer);

      const { error } = await supabase.from('applications').insert({
        student_id: profile.id,
        internship_id: selectedOffer.id,
        carta_presentacion: cartaTexto,
        correo_director_carrera: correoDirector.trim(),
        certificado_alumno_regular_url: alumnoRegularUrl,
        certificado_notas_url: notasUrl,
      });

      if (error) {
        throw new Error(error.message);
      }

      setFeedback({
        type: 'ok',
        text: '¡Postulación, Carta de Presentación y Certificados PDF enviados correctamente!',
      });
      setSelectedOffer(null);
      loadStudentData();
    } catch (err: any) {
      setModalError(err.message || 'Ocurrió un error al enviar la postulación.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPdf = async (offer: any) => {
    setLoadingPdf(true);
    try {
      const element = document.getElementById('carta-pdf-preview');
      if (!element) return;
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf()
        .from(element)
        .set({
          margin: 15,
          filename: `Carta_Presentacion_${(offer.companies?.razon_social || 'Practica').replace(/\s+/g, '_')}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, backgroundColor: '#ffffff', useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        } as any)
        .save();
    } catch (err) {
      console.error('Error generando PDF:', err);
      alert('No se pudo descargar el PDF. Intenta nuevamente.');
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-white text-[#0f4cff] flex items-center justify-center font-bold">
        Cargando portal del estudiante...
      </div>
    );
  }

  const alreadyAppliedIds = applications.map((a) => a.internship_id);

  const visibleInternships = onlyMyCareer
    ? internships.filter(
        (offer) =>
          !offer.carreras_admitidas?.length ||
          offer.carreras_admitidas.includes(profile.career)
      )
    : internships;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Barra superior blanca */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex bg-gray-100 rounded-full overflow-hidden font-black text-sm border border-gray-200">
            <Link href="/practicas" className="bg-white text-black px-5 py-2 rounded-l-full hover:bg-gray-50">
              PRACTI
            </Link>
            <Link href="/" className="bg-[#ccff00] text-black px-5 py-2 rounded-full -ml-3 relative z-10 border-2 border-white">
              FLOW
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="bg-gray-900 text-white font-bold px-5 py-2 rounded-full text-xs hover:bg-[#0f4cff] transition cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
        {/* 1. PERFIL DEL ESTUDIANTE */}
        <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-[30px] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-[#0f4cff] text-white font-black text-3xl flex items-center justify-center shrink-0">
              {profile.full_name?.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-xs font-black uppercase text-[#0f4cff] bg-blue-50 px-3 py-1 rounded-full">
                {profile.university}
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">{profile.full_name}</h1>
              <p className="text-gray-600 font-semibold text-sm">{profile.career}</p>
              <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                <span>RUT: {profile.rut}</span>
                <span>•</span>
                <span>{profile.email}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#ccff00] px-6 py-4 rounded-2xl text-center border border-lime-300 shrink-0">
            <p className="text-[11px] text-gray-800 uppercase font-black">Postulaciones Usadas</p>
            <p className="text-black font-black text-3xl">{applications.length} / 3</p>
          </div>
        </div>

        {feedback && (
          <div className={`p-4 rounded-2xl font-bold text-sm ${feedback.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-[#ccff00] text-black'}`}>
            {feedback.text}
          </div>
        )}

        {/* 2. MIS 3 POSTULACIONES ENVIADAS */}
        <div className="bg-white border border-gray-200 rounded-[30px] p-6 md:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-black text-gray-900">Mis Postulaciones ({applications.length}/3)</h2>
            <span className="text-xs font-semibold text-gray-500">Estado actualizado por cada empresa</span>
          </div>

          {applications.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              Aún no has postulado a ninguna práctica. Selecciona una oferta compatible abajo para subir tus PDFs y postular.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {applications.map((app) => (
                <div key={app.id} className="border border-gray-200 rounded-2xl p-5 flex flex-col justify-between bg-gray-50/70">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="text-xs font-black uppercase text-[#0f4cff]">{app.internships?.companies?.razon_social}</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {app.status === 'accepted' ? '✓ Aceptada' : app.status === 'rejected' ? '✕ Rechazada' : '⏳ Pendiente'}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-gray-900">{app.internships?.titulo}</h3>
                    <p className="text-xs text-gray-500 mt-1">{app.internships?.modalidad} • Práctica {app.internships?.tipo_practica}</p>
                    <p className="text-[11px] text-gray-600 mt-2">
                      Director Carrera: <span className="font-semibold">{app.correo_director_carrera}</span>
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 space-y-1.5">
                    <div className="flex gap-2 text-[11px] font-bold">
                      {app.certificado_alumno_regular_url && (
                        <a href={app.certificado_alumno_regular_url} target="_blank" rel="noreferrer" className="text-[#0f4cff] underline">
                          PDF Alumno Regular
                        </a>
                      )}
                      {app.certificado_notas_url && (
                        <a href={app.certificado_notas_url} target="_blank" rel="noreferrer" className="text-[#0f4cff] underline">
                          PDF Notas
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Enviada el {new Date(app.created_at).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. CATÁLOGO DE PRÁCTICAS COMPATIBLES */}
        <div className="bg-white border border-gray-200 rounded-[30px] p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">Prácticas Disponibles ({visibleInternships.length})</h2>
              <p className="text-xs text-gray-500">Solo puedes postular a vacantes que admitan tu carrera ({profile.career}).</p>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setOnlyMyCareer(true)}
                className={`px-3.5 py-2 rounded-lg transition cursor-pointer ${onlyMyCareer ? 'bg-[#0f4cff] text-white' : 'text-gray-600'}`}
              >
                Para mi carrera
              </button>
              <button
                onClick={() => setOnlyMyCareer(false)}
                className={`px-3.5 py-2 rounded-lg transition cursor-pointer ${!onlyMyCareer ? 'bg-[#0f4cff] text-white' : 'text-gray-600'}`}
              >
                Ver todas
              </button>
            </div>
          </div>

          {visibleInternships.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center bg-gray-50 rounded-2xl">
              No hay ofertas disponibles en esta vista por el momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleInternships.map((offer) => {
                const isApplied = alreadyAppliedIds.includes(offer.id);
                const limitReached = applications.length >= 3;
                const isCareerAllowed =
                  !offer.carreras_admitidas?.length ||
                  offer.carreras_admitidas.includes(profile.career);

                return (
                  <div key={offer.id} className="border border-gray-200 rounded-2xl overflow-hidden flex flex-col justify-between bg-white hover:shadow-md transition">
                    <div>
                      {offer.imagen_url ? (
                        <img src={offer.imagen_url} alt={offer.titulo} className="w-full h-40 object-cover" />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-[#0f4cff] font-black text-lg px-4 text-center">
                          {offer.companies?.razon_social}
                        </div>
                      )}

                      <div className="p-5">
                        <div className="flex justify-between items-center gap-2 mb-2">
                          <span className="text-xs font-black text-[#0f4cff] uppercase truncate">{offer.companies?.razon_social}</span>
                          <span className="bg-[#ccff00] text-black text-[11px] font-black px-2.5 py-0.5 rounded-full shrink-0">
                            Práctica {offer.tipo_practica}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-gray-900">{offer.titulo}</h3>
                        <p className="text-xs text-gray-500 mt-1">{offer.modalidad}</p>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{offer.descripcion}</p>

                        {offer.carreras_admitidas?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {offer.carreras_admitidas.map((c: string) => (
                              <span
                                key={c}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  c === profile.career ? 'bg-blue-100 text-[#0f4cff]' : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button
                        disabled={isApplied || limitReached || !isCareerAllowed}
                        onClick={() => openApplicationModal(offer)}
                        className={`w-full font-bold py-3 rounded-xl text-sm transition cursor-pointer ${
                          isApplied
                            ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                            : !isCareerAllowed
                            ? 'bg-red-50 text-red-500 border border-red-200 cursor-not-allowed'
                            : limitReached
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-[#0f4cff] text-white hover:bg-[#0b3bcc]'
                        }`}
                      >
                        {isApplied
                          ? '✓ Ya postulaste'
                          : !isCareerAllowed
                          ? 'Carrera no admitida'
                          : limitReached
                          ? 'Límite de 3 alcanzado'
                          : 'Adjuntar Documentos y Postular'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. MODAL DE DOCUMENTOS OBLIGATORIOS + CARTA DE PRESENTACIÓN */}
        {selectedOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white text-gray-900 rounded-[30px] p-6 md:p-8 max-w-2xl w-full shadow-2xl relative max-h-[92vh] overflow-y-auto">
              <button onClick={() => setSelectedOffer(null)} className="absolute top-5 right-5 text-gray-400 hover:text-black font-bold text-xl cursor-pointer">✕</button>

              <h3 className="text-2xl font-black text-[#0f4cff] mb-1">Postulación y Documentación</h3>
              <p className="text-sm text-gray-600 mb-5">
                Completa los respaldos obligatorios para postular a <strong>{selectedOffer.companies?.razon_social}</strong>.
              </p>

              {/* Formulario de documentos PDF + Director de Carrera */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-800 mb-1">
                    Correo del Director/a de Carrera *
                  </label>
                  <input
                    type="email"
                    required
                    value={correoDirector}
                    onChange={(e) => setCorreoDirector(e.target.value)}
                    placeholder="director.carrera@universidad.cl"
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0f4cff]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-800 mb-1">
                      1. Certificado Alumno Regular (Solo PDF) *
                    </label>
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={(e) => handleFileChange(e, setCertAlumnoRegular)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#0f4cff] file:text-white file:font-bold"
                    />
                    {certAlumnoRegular && (
                      <p className="text-[11px] text-emerald-700 font-bold mt-1 truncate">
                        ✓ {certAlumnoRegular.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-gray-800 mb-1">
                      2. Certificado de Notas (Solo PDF) *
                    </label>
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={(e) => handleFileChange(e, setCertNotas)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#0f4cff] file:text-white file:font-bold"
                    />
                    {certNotas && (
                      <p className="text-[11px] text-emerald-700 font-bold mt-1 truncate">
                        ✓ {certNotas.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Vista previa de Carta de Presentación con colores HEX puros */}
              <div
                id="carta-pdf-preview"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#111827',
                  border: '1px solid #d1d5db',
                  borderRadius: '16px',
                  padding: '24px',
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-line',
                }}
                className="mb-5"
              >
                <div style={{ borderBottom: '2px solid #0f4cff', paddingBottom: '10px', marginBottom: '14px' }}>
                  <strong style={{ color: '#0f4cff', fontSize: '15px' }}>{profile.university}</strong>
                  <div style={{ fontSize: '11px', color: '#4b5563' }}>Dirección de Prácticas Profesionales • Carta de Presentación</div>
                </div>
                {buildCartaText(selectedOffer)}
              </div>

              {modalError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-bold">
                  ⚠️ {modalError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => handleDownloadPdf(selectedOffer)}
                  disabled={loadingPdf}
                  className="bg-gray-900 text-white font-bold px-5 py-3.5 rounded-xl hover:bg-gray-800 transition cursor-pointer text-sm"
                >
                  {loadingPdf ? 'Generando PDF...' : 'Descargar Carta PDF'}
                </button>
                <button
                  type="button"
                  onClick={handleApplyWithLetter}
                  disabled={submitting || !certAlumnoRegular || !certNotas || !correoDirector.trim()}
                  className={`flex-1 font-black py-3.5 rounded-xl shadow-md transition text-sm ${
                    submitting || !certAlumnoRegular || !certNotas || !correoDirector.trim()
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#ccff00] hover:bg-[#b3e600] text-black cursor-pointer'
                  }`}
                >
                  {submitting ? 'Subiendo PDFs y enviando...' : 'Confirmar y Enviar Postulación'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}