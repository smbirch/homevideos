"use client";

import Link from "next/link";

const AboutPage = () => {
  return (
    <div>

      <main className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
        <section className="text-lg mb-12">
          <h2 className="text-3xl font-bold mb-4">Birch Family Videos</h2>
          <p className="mb-4">This site exists as a place for my family to view our digitized home videos.</p>
          <p className="mb-4">For more info see <Link className="text-orange-500" href={"https://github.com/smbirch/homevideos"}>my GitHub</Link></p>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
