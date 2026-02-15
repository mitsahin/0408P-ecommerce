import { Link } from 'react-router-dom'

const teamMembers = [
  {
    id: 'gokhan',
    name: 'Gökhan Özdemir',
    role: 'Project Manager',
    image:
      'https://i.pravatar.cc/300?img=12',
  },
  {
    id: 'assistant',
    name: 'GitHub Copilot',
    role: 'Full Stack Developer',
    image:
      'https://i.pravatar.cc/300?img=32',
  },
  {
    id: 'member-1',
    name: 'Elif Kaya',
    role: 'UI Designer',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=facearea&w=300&h=300&q=80',
  },
  {
    id: 'member-2',
    name: 'Mert Aydin',
    role: 'Frontend Developer',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=300&h=300&q=80',
  },
]

const TeamPage = () => {
  return (
    <section className="flex w-full flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="text-slate-700">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-400">Team</span>
      </div>
      <div className="flex w-full flex-col gap-3 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Meet the Team</h1>
        <p className="text-sm text-slate-500">
          The people behind the ecommerce experience.
        </p>
      </div>
      <div className="flex w-full flex-wrap gap-[30px]">
        {teamMembers.map((member) => (
          <article
            key={member.id}
            className="flex w-full flex-col items-center gap-4 border border-slate-200 bg-white px-4 py-6 sm:w-[calc(50%-15px)] lg:w-[calc(25%-22.5px)]"
          >
            <img
              src={member.image}
              alt={member.name}
              className="h-[120px] w-[120px] rounded-full bg-white object-contain object-center"
            />
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-sm font-semibold text-slate-900">
                {member.name}
              </h3>
              <p className="text-xs text-slate-500">{member.role}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TeamPage
