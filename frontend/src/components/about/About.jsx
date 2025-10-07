 
import {Link} from 'react-router-dom'
import { aboutCardImg, aboutImg } from '../../assets/images'
function About() {
  return <section>
    <div className="container">
        <div className="flex justify-between gap-[50px] lg:gap-[130px] xl:gap-0 flex-col lg:flex-row">

            {/* about image */}
            <div className="relative w-3/4 lg:w-1/2 xl:w-[770px] z-10 order-2 lg:order-1">
            <img src={aboutImg} alt="" />
            <div className="absolute z-20 bottom-4 w-[200px] md:w-[300px] right-[-30%] md:right-[-7%] lg:right-[22%] ">
                <img src={aboutCardImg} alt="" />
            </div>
            </div>
            {/* about content */}
            <div className="w-full lg:w-1/2 xl:w-[670px] order-1 lg:order-2">
            <h2 className='heading'>
              proud to be one of the best uprising startup
            </h2>
            <p className='text_para'>
              for the past one year we have been recognized by the ministry of health as one of the best site offering medical care to patients across the country
            </p>
            <p className="text_para mt-[30px]">offering best medica care is something we strive for each day,caring for our patients-not looking at what we have accomplished but what we can do tomorrow.reaching out to all patients who needs us is our goal </p>
            <Link to='/'>
            <button className='btn'>learn more</button>
            </Link>

            </div>

            
        </div>
    </div>
  </section>
}

export default About