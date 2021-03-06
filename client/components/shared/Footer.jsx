const Footer = () => {
  // Footer component

  return (
    <footer className='bg-purple-4 px-4 py-6 w-full sticky top-[100vh] z-0'>
      <img
        src='https://www.atcampus.no/_next/static/media/atcampus-full-logo.2e7d1a2a.svg'
        alt=''
      />
      <h3 className='text-dark-2'>Get unstuck</h3>
      <div>
        <ul className='text-dark-2 grid grid-cols-1 gap-1 py-4'>
          <li className='underline underline-offset-4 decoration-2 decoration-white cursor-pointer'>
            Regler
          </li>
          <li className='underline underline-offset-4 decoration-2 decoration-white cursor-pointer'>
            Bruksvilkår
          </li>
          <li className='underline underline-offset-4 decoration-2 decoration-white cursor-pointer'>
            Salgsvilkår
          </li>
          <li className='underline underline-offset-4 decoration-2 decoration-white cursor-pointer'>
            Personvernsærklæring
          </li>
          <li className='underline underline-offset-4 decoration-2 decoration-white cursor-pointer'>
            Om atcampus
          </li>
          <li className='underline underline-offset-4 decoration-2 decoration-white cursor-pointer'>
            Gi tilbakemelding
          </li>
          <li className='underline underline-offset-4 decoration-2 decoration-white cursor-pointer'>
            Ledige stillinger
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
