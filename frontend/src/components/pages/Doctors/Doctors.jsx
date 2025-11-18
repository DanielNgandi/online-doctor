
//import DoctorCard from './../../DoctorsList/DoctorCard'
//import { doctors } from '../../../assets/data/doctors'
import DoctorsList from '../../DoctorsList/DoctorsList'
import Testiminial from '../../Testimonial/TestimonialPage'
import { useState } from "react";
function Doctors() {
 const [search, setSearch] = useState("");

  return (
    <>
      {/* Add pt-20 to prevent header overlapping */}
      <section className='bg-[#fff9ea] pt-20'>
        <div className="container text-center">
          <h2 className="heading">Find a doctor</h2>
          <div className="max-w-[570px] mt-[30px] mx-auto bg-[#1943832c] rounded-md flex items-center">
            <input 
              type='search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='py-4 pl-4 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor'
              placeholder='Search doctor by name or specialty'
            />
            <button 
              className='bg-blue-600 py-4 px-6 text-white rounded-r-md hover:bg-blue-700 transition-colors'
              onClick={() => setSearch(search)}
            >
              Search
            </button>
          </div>
        </div>
      </section>
      
      {/* Doctors List Section - Fixed grid layout */}
      <section className="py-8">
        <div className="container">
          {/* Remove one of the grid divs and use proper column structure */}
          <DoctorsList search={search}/>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <div className="heading text-center">
              <h2>What our patients say</h2>
              <p className="text_para text-center">
                World-class care for everyone. Our health system offers unmatched, expert care
              </p>
            </div>
          </div>
          <Testiminial/>
        </div>
      </section>
    </>
  )
}

export default Doctors