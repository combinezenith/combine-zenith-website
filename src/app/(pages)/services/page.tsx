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
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum magni placeat quo nesciunt! Perspiciatis, reprehenderit? Quibusdam, magni. Nihil ea sint obcaecati delectus id, fuga repellendus. Dolorum totam aspernatur deleniti necessitatibus.
          </p>
        </header>

        <ServiceCard />
      </div>
    </main>
  )
}
