import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Linkedin, Mail } from 'lucide-react'
import umitSahinImage from '../assets/umit-sahin.png'

const baseTeamMembers = [
  {
    id: 'gokhan',
    name: 'Gökhan Özdemir',
    role: 'Project Manager',
    gender: 'men',
  },
  {
    id: 'umit',
    name: 'Ümit Şahin',
    role: 'Full Stack Developer',
    image: umitSahinImage,
    fixedImage: true,
  },
  {
    id: 'member-1',
    name: 'Elif Kaya',
    role: 'UI Designer',
    gender: 'women',
  },
  {
    id: 'member-2',
    name: 'Mert Aydin',
    role: 'Frontend Developer',
    gender: 'men',
  },
]

const TeamPage = () => {
  const teamMembers = useMemo(
    () =>
      baseTeamMembers.map((member) => {
        if (member.fixedImage) return member
        const randomIndex = Math.floor(Math.random() * 90) + 1
        return {
          ...member,
          image: `https://randomuser.me/api/portraits/${member.gender}/${randomIndex}.jpg`,
        }
      }),
    []
  )

  const highlights = [
    { id: 'h1', label: 'Active Projects', value: '12+' },
    { id: 'h2', label: 'Happy Customers', value: '8K+' },
    { id: 'h3', label: 'Product Releases', value: '150+' },
    { id: 'h4', label: 'Support Response', value: '< 30m' },
  ]

  return (
    <section className="flex w-full flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="text-slate-700">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-400">Team</span>
      </div>
      <div className="rounded border border-slate-200 bg-white px-6 py-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">
          Team
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Meet the Team</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
          A multidisciplinary team building a fast, reliable and user-friendly ecommerce
          experience from catalog to checkout.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {highlights.map((item) => (
          <div
            key={item.id}
            className="rounded border border-slate-200 bg-white px-3 py-4 text-center"
          >
            <p className="text-xl font-semibold text-slate-900">{item.value}</p>
            <p className="text-xs text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="flex w-full flex-wrap gap-[30px]">
        {teamMembers.map((member) => (
          <article
            key={member.id}
            className="flex w-full flex-col items-center gap-4 rounded border border-slate-200 bg-white px-4 py-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:w-[calc(50%-15px)] lg:w-[calc(25%-22.5px)]"
          >
            <img
              src={member.image}
              alt={member.name}
              className="h-[120px] w-[120px] rounded-full border border-slate-100 bg-white object-cover object-center"
            />
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-sm font-semibold text-slate-900">
                {member.name}
              </h3>
              <p className="text-xs text-slate-500">{member.role}</p>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <Linkedin className="h-4 w-4 transition hover:text-slate-700" />
              </a>
              <a href="mailto:hello@bandage.com">
                <Mail className="h-4 w-4 transition hover:text-slate-700" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TeamPage
