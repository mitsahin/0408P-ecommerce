import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Play, Twitter } from 'lucide-react'
import aboutVideo from '../assets/vmedia bg-cover.png'
import aboutHeroBg from '../assets/background (1).png'
import ctaImage from '../assets/abtajt.png'
import teamOne from '../assets/team-1-user-1.jpg'
import teamThree from '../assets/team-1-user-3-1.jpg'
import umitSahinImage from '../assets/umit-sahin.png'
import brandOne from '../assets/fa-brands-1.png'
import brandTwo from '../assets/fa-brands-2.png'
import brandThree from '../assets/fa-brands-3.png'
import brandFour from '../assets/fa-brands-4.png'
import brandFive from '../assets/fa-brands-5.png'

const teamMembers = [
  {
    id: 'team-1',
    name: 'Courtney Henry',
    role: 'Designer',
    image: teamOne,
    socials: {
      twitter: 'https://x.com',
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
  },
  {
    id: 'team-2',
    name: 'Ümit Şahin',
    role: 'Full Stack Developer',
    image: umitSahinImage,
    socials: {
      twitter: 'https://x.com',
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
  },
  {
    id: 'team-3',
    name: 'Brooklyn Simmons',
    role: 'Product Owner',
    image: teamThree,
    socials: {
      twitter: 'https://x.com',
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
  },
]

const brandLogos = [brandOne, brandTwo, brandThree, brandFour, brandFive]

const AboutPage = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  return (
    <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="text-slate-700">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-400">About</span>
      </div>
      <div className="flex w-full flex-col gap-12">
        <div className="flex w-full flex-col items-center gap-8 rounded border border-slate-200 bg-white p-4 text-center sm:gap-10">
          <div className="flex w-full flex-col items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              ABOUT COMPANY
            </span>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
              ABOUT US
            </h1>
            <p className="max-w-[560px] text-sm text-slate-500">
              We know how large objects will act, but things on a small scale just
              do not act that way.
            </p>
            <Link
              to="/contact"
              className="mx-auto flex w-fit items-center rounded bg-sky-500 px-6 py-3 text-xs font-semibold text-white"
            >
              Get Quote Now
            </Link>
          </div>
          <div className="relative flex w-full items-center justify-center">
            <div className="absolute -right-6 top-6 hidden h-[72px] w-[72px] rounded-full bg-rose-100 sm:block" />
            <div className="absolute -left-4 bottom-6 hidden h-[24px] w-[24px] rounded-full bg-violet-300 sm:block" />
            <div className="absolute right-12 top-1/2 hidden h-[12px] w-[12px] rounded-full bg-violet-400 sm:block" />
            <img
              src={aboutHeroBg}
              alt="About hero"
              className="h-[260px] w-full object-contain object-center sm:h-[320px]"
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-6 rounded border border-slate-200 bg-white p-6 text-center">
          <div className="flex w-full max-w-[760px] flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
              Problems trying
            </span>
            <h2 className="text-lg font-semibold text-slate-900">
              Met minim Mollie non desert Alamo est sit cliquey dolor do met sent.
            </h2>
          </div>
          <p className="max-w-[760px] text-sm text-slate-500">
            Problems trying to resolve the conflict between the two major realms
            of Classical physics: Newtonian mechanics.
          </p>
        </div>

        <div className="flex w-full flex-wrap gap-6 text-center">
          <div className="flex w-[calc(50%-12px)] flex-col gap-1 sm:w-[calc(25%-18px)]">
            <span className="text-2xl font-bold text-slate-900">15K</span>
            <span className="text-xs text-slate-500">Happy Customers</span>
          </div>
          <div className="flex w-[calc(50%-12px)] flex-col gap-1 sm:w-[calc(25%-18px)]">
            <span className="text-2xl font-bold text-slate-900">150K</span>
            <span className="text-xs text-slate-500">Monthly Visitors</span>
          </div>
          <div className="flex w-[calc(50%-12px)] flex-col gap-1 sm:w-[calc(25%-18px)]">
            <span className="text-2xl font-bold text-slate-900">15</span>
            <span className="text-xs text-slate-500">Countries Worldwide</span>
          </div>
          <div className="flex w-[calc(50%-12px)] flex-col gap-1 sm:w-[calc(25%-18px)]">
            <span className="text-2xl font-bold text-slate-900">100+</span>
            <span className="text-xs text-slate-500">Top Partners</span>
          </div>
        </div>

        <div className="mx-auto flex w-full items-center justify-center rounded border border-slate-200 bg-white p-4 lg:py-12">
          <div
            className="relative flex w-full max-w-[989px] items-center justify-center overflow-hidden rounded bg-cover bg-center min-h-[220px] sm:min-h-[320px] lg:h-[540px] lg:rounded-[20px]"
            style={{ backgroundImage: `url(${aboutVideo})` }}
            role="img"
            aria-label="Company video"
          >
            <button
              type="button"
              onClick={() => setIsVideoOpen(true)}
              className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-white shadow-sm transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
              aria-label="Play video"
            >
              <Play className="h-5 w-5 fill-white" />
            </button>
          </div>
        </div>
        {isVideoOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Company video"
            onClick={() => setIsVideoOpen(false)}
          >
            <div
              className="relative w-full max-w-[900px] overflow-hidden rounded-[20px] bg-black"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 transition hover:bg-white"
                onClick={() => setIsVideoOpen(false)}
                aria-label="Close video"
              >
                Close
              </button>
              <div className="relative w-full pb-[56.25%]">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1"
                  title="Company video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex w-full flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Meet Our Team
            </span>
            <h2 className="text-2xl font-semibold text-slate-900">Meet Our Team</h2>
            <p className="text-sm text-slate-500">
              Problems trying to resolve the conflict between the two major realms
              of Classical physics: Newtonian mechanics.
            </p>
          </div>
          <div className="flex w-full flex-wrap justify-center gap-[30px]">
            {teamMembers.map((member) => (
              <article
                key={member.id}
                className="flex w-full max-w-[332px] flex-col items-center gap-4 rounded border border-slate-200 bg-white px-4 py-6 sm:w-[calc(33.333%-20px)]"
              >
                <Link to="/team" aria-label={`${member.name} profile`}>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-[120px] w-[120px] rounded-full object-cover object-center transition hover:opacity-90"
                  />
                </Link>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <a
                    href={member.socials.twitter}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} Twitter`}
                  >
                    <Twitter className="h-4 w-4 transition hover:text-slate-700" />
                  </a>
                  <a
                    href={member.socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} Facebook`}
                  >
                    <Facebook className="h-4 w-4 transition hover:text-slate-700" />
                  </a>
                  <a
                    href={member.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} Instagram`}
                  >
                    <Instagram className="h-4 w-4 transition hover:text-slate-700" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-6 rounded bg-slate-50 py-10 text-center">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-xl font-semibold text-slate-900">
              Big Companies Are Here
            </h2>
            <p className="text-sm text-slate-500">
              Problems trying to resolve the conflict between the two major realms
              of Classical physics: Newtonian mechanics.
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center justify-center gap-8">
            {brandLogos.map((logo, index) => (
              <img
                key={`${logo}-${index}`}
                src={logo}
                alt="Brand logo"
                className="h-7 object-contain opacity-70"
              />
            ))}
          </div>
        </div>

        <div className="mx-auto flex w-full flex-col overflow-hidden bg-sky-500 text-white sm:flex-row sm:items-stretch lg:h-[636px]">
          <div className="flex w-full flex-col items-center gap-3 px-6 py-10 text-center sm:w-[55%] sm:px-12 sm:py-16 lg:px-20 lg:py-20">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              WORK WITH US
            </span>
            <h2 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
              Now Let&apos;s grow Yours
            </h2>
            <p className="text-sm text-white/80">
              The gradual accumulation of information about atomic and small-scale
              behavior during the first quarter of the 20th.
            </p>
            <Link
              to="/contact"
              className="mt-2 flex w-fit items-center rounded border border-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white"
            >
              Contact us
            </Link>
          </div>
          <div className="flex w-full items-center justify-center bg-slate-50 sm:w-[45%]">
            <img
              src={ctaImage}
              alt="Work with us"
              className="h-[260px] w-full object-cover object-right sm:h-full sm:w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPage
