// Arma el texto de la carta de presentación del estudiante para una oferta
export function construirTextoCarta(estudiante: any, oferta: any, correoDirector: string) {
  if (!estudiante || !oferta) return '';
  return `Estimado/a Supervisor/a de ${oferta.companies?.razon_social} (${oferta.companies?.correo_contacto}):

Por medio de la presente, la institución ${estudiante.university} certifica que nuestro/a estudiante ${estudiante.full_name} (RUT: ${estudiante.rut}), perteneciente a la carrera de ${estudiante.career}, cumple con matrícula activa y se encuentra habilitado/a académicamente para postular y cursar su Práctica Profesional ${oferta.tipo_practica} en el cargo "${oferta.titulo}" en vuestra organización (RUT: ${oferta.companies?.rut_empresa}).

Contacto Dirección de Carrera para validación académica: ${correoDirector || '[Ingresa correo del Director de Carrera]'}

Se adjuntan Certificado de Alumno Regular y Certificado de Notas vigentes en formato PDF. Quedamos a su entera disposición para coordinar la cobertura de seguro escolar Ley N° 16.744 requerida.

Atentamente,
Coordinación de Prácticas Profesionales
${estudiante.university}`;
}

// Descarga como PDF el elemento HTML que contiene la carta
export async function descargarCartaPdf(idDelElemento: string, nombreDelArchivo: string) {
  const elementoDeLaCarta = document.getElementById(idDelElemento);
  if (!elementoDeLaCarta) return;
  const html2pdf = (await import('html2pdf.js')).default;
  await html2pdf()
    .from(elementoDeLaCarta)
    .set({
      margin: 15,
      filename: nombreDelArchivo,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: '#ffffff', useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    } as any)
    .save();
}