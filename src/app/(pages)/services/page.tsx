import ServiceCard from '@/app/(components)/ServiceCard'
import React from 'react'

export default function Service() {
  return (
    <main className=" py-12 px-4 sm:px-6 lg:px-8 mt-24" aria-label='Services Page'>
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Our Services
          </h1>
          <p className="mt-4 text-sm sm:text-base md:text-lg max-w-3xl mx-auto">
            At Combine Zenith, we turn creativity into connection and ideas into impact.
            Our services are designed to help brands grow with purpose, clarity, and authenticity.
            From strategy to storytelling, design to digital, we bring your vision to life with meaning and
            precision.
          </p>
          <ServiceCard />
        </header>
      </div>
    </main>
  )
}