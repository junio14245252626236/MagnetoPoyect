const prisma = require("../lib/prisma.ts").default;

const jobs = [
  { title: "Profesor de matemáticas", company: "Colegio Central", location: "Medellín", description: "Impartir clases de matemáticas a estudiantes de secundaria." },
  { title: "Aseador", company: "Limpio S.A.", location: "Bogotá", description: "Responsable de la limpieza y mantenimiento de oficinas." },
  { title: "Recepcionista", company: "Hotel Plaza", location: "Cali", description: "Atención al cliente y gestión de reservas en hotel." },
  { title: "Desarrollador web", company: "Tech Solutions", location: "Remoto", description: "Desarrollo y mantenimiento de sitios web corporativos." },
  { title: "Cajero", company: "Supermercado Éxito", location: "Barranquilla", description: "Cobro y atención al cliente en caja." },
  { title: "Vigilante", company: "Seguridad Total", location: "Medellín", description: "Supervisión y control de acceso en edificio empresarial." },
  { title: "Auxiliar de cocina", company: "Restaurante Gourmet", location: "Cartagena", description: "Apoyo en la preparación de alimentos y limpieza de cocina." },
  { title: "Conductor", company: "Transportes Rápidos", location: "Bogotá", description: "Transporte de pasajeros y mercancía en rutas urbanas." },
  { title: "Jardinero", company: "Verde Urbano", location: "Cali", description: "Mantenimiento de jardines y áreas verdes." },
  { title: "Secretaria", company: "Consultorio Médico", location: "Medellín", description: "Gestión de agenda y atención telefónica." },
  // ...agrega más empleos variados hasta llegar a 100
];

async function main() {
  for (let i = 0; i < 100; i++) {
    const job = jobs[i % jobs.length];
    await prisma.job.create({
      data: {
        title: `${job.title} ${i + 1}`,
        company: job.company,
        location: job.location,
        description: job.description,
      },
    });
  }
  console.log("100 empleos creados");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
