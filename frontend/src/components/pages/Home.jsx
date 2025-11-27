
// import videoIcon from '../../assets/images/video-icon.png'
import {heroImg01,heroImg02,heroImg03,featureImg,icon01,icon02,icon03,videoIcon} from '../../assets/images'
import DoctorsList from '../DoctorsList/DoctorsList'
import avatarIcon from '../../assets/images/avatar-icon.png'
import faqImg from '../../assets/images/faq-img.png'
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import About from "../about/About";
import ServiceList from "../services/ServiceList";
import FaqList from '../FAQ/FaqList';
import Testimonial from '../Testimonial/Testimonial';
import ImageSlideshow from '../ImageSlideshow'; 
function Home() {

const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <section className="hero_section pt-[0px]">
        <div className="container">
          <div className="w-full">
            <ImageSlideshow interval={6000} /> 
          </div>
        </div>
      </section>
      <section className="hero_section pt-[60px] 2xl:h-[800px]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-[90px] items-center justify-between">
  
            {/* hero content */}
            <div>
              <div className="lg:w-[570px]">
                <h1 className="text-[36px] leading-[46px] text-headingColor font-[800] md:text-[60px] md:leading-[70px]">
                  we save life by helping patients access medical care easily
                </h1>
                <p className="text_para">
          Book an appointment with a qualified doctor at your convenience.
        </p>
        <Link to="/book-appointment">
  <button className="btn">Request an Appointment</button>
</Link>
              </div>
              {/* hero counter */}
              <div className="mt-[300px] lg:mt-[70px] flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-[30px]">
                <div>
                  <h2 className="text-[30px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                    30+
                  </h2>
                  <span className="w-[100px] h-2 bg-yellowColor rounded-full block mt-[-14px]"></span>
                  <p className="text_para">years of experience</p>
                </div>

                <div>
                  <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                    15+
                  </h2>
                  <span className="w-[100px] h-2 bg-purpleColor rounded-full block mt-[-14px]"></span>
                  <p className="text_para">clinics countrywide</p>
                </div>

                <div>
                  <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                    100%
                  </h2>
                  <span className="w-[100px] h-2 bg-irisBlueColor rounded-full block mt-[-14px]"></span>
                  <p className="text_para">patient satisifaction</p>
                </div>
              </div>
            </div>
            {/* hero content */}
            <div className="flex gap-[30px] justify-end">
              <div>
                <img className="w-full" src={heroImg01} alt="" />
              </div>

              <div className="mt-[30px]">
                <img className="w-full mb-[30px]" src={heroImg02} alt="" />
                <img className="w-full" src={heroImg03} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* hero section end */}

      <section>
        <div className="container">
          <div className="lg:w-[470px] mx-auto">
            <h2 className="heading text-center">
              Providing the best medical services
            </h2>
            <p className="text_para text-center">
              world-class care for everyone. our health system offers
              unmatched,expert health care{" "}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px] ">
            <div className="py-[30px] px-5 ">
              <div className="flex items-center justify-center">
                <img src={icon01} alt="" />
              </div>

              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  find a doctor
                </h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  world class care for everyone. our health system offers
                  unmatched,expert health care.from the lab to the clinic
                </p>
                <Link
                  to="/doctors"
                  className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor"
                >
                  <BsArrowRight className="group-hover:text-white w-6 h-5" />
                </Link>
              </div>
            </div>

            <div className="py-[30px] px-5 ">
              <div className="flex items-center justify-center">
                <img src={icon02} alt="" />
              </div>

              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  find location
                </h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  world class care for everyone. our health system offers
                  unmatched,expert health care.from the lab to the clinic
                </p>
                <Link
                  to="/doctors"
                  className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor"
                >
                  <BsArrowRight className="group-hover:text-white w-6 h-5" />
                </Link>
              </div>
            </div>

            <div className="py-[30px] px-5 ">
              <div className="flex items-center justify-center">
                <img src={icon03} alt="" />
              </div>

              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  book appointment
                </h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  world class care for everyone. our health system offers
                  unmatched,expert health care.from the lab to the clinic
                </p>
                <Link
                  to="/doctors"
                  className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor"
                >
                  <BsArrowRight className="group-hover:text-white w-6 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* about section */}
      <About />

      {/* services section */}
      <section>
        <div className="container ">
          <div className="xl:w-[470px] mx-auto  ">
            <h2 className="heading text-center">our medical services</h2>
            <p className="text_para text-center">
              world-class care for everyone. our site offers unmatched expert
              health care
            </p>
          </div>
          <ServiceList/>
        </div>
      </section>
      {/* service section ends */}
      {/* feature section */}
      <section>
      <div className="container">
        <div className="flex items-center justify-between flex-col lg:flex-row">
          {/* feature content */}
          <div className="xl:w-[670px]">
            <h2 className="heading">Get virtual treatment <br/>anytime</h2>
            <ul className="pl-4">
              <li className="text_para">
                1. Schedule the appointment directly
              </li>
              <li className="text_para">2. search for your physician here and contact their office</li>
              <li className="text_para">3. view physcians who are accepting new patients, use the online scheduling tool to select a appointment time</li>
            </ul>
            <Link to='/'>
            <button className="btn">Learn more</button>
            </Link>
      
          </div>
          {/* feature img */}
          <div className="relative z-10 xl:w-[770px] flex justify-end mt-[50px] lg:mt-0">
            <img src={featureImg} className="w-3/4" alt="" />
            <div className="w-[150px] lg:w-[248px] bg-white absolute bottom-[50px] left-0 md:bottom-[100px] md:left-5 z-20 p-2 pb-3 lg:px-4 lg:pb-[26px] rounded-[10px]">
              <div className="flex item-center justify-between">
                <div className="flex items-center gap-[6px] lg:gap-3">
                  <p className="text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-headingColor font-[600]">Tue 24</p>
                  <p className="text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-headingColor font-[400]">10:00AM</p>
                  <span className="w-5 h-5 lg:w-[34px] lg:h-[34px] flex items-center justify-center bg-yellowColor rounded py-1 px-[6px] lg:py-3 lg:px-[9px]">
                    <img src={videoIcon} alt="" />
                  </span>
                
                </div>
              </div>
          
            <div className="w-[65px] lg:w-[96px] bg-[#CCF0F3] py-1 px-2 lg:py-[6px] lg:px-[10px] text-[8px] leading-[8px] lg:text-[12px] lg:leading-4 text-irisBlueColor font-[500] mt-2 lg:mt-4">
              consultation
              </div>   
              <div className="flex items-center gap-[6px] lg:gap-[10px] mt-2 lg:mt-[18px]">
                <img src={avatarIcon} alt="" />
                <h4 className='text-[10px] leading-3 lg:text-[16px] lg:leading-[22px] font-[700] text-headingColor'>Wayne Collins</h4>
                </div>         
            </div>
          </div>
        </div>
      </div>
      </section>
       
      {/* feature section ends */}
      {/* our great doctors */}
  <section>
  {user && user.role?.toLowerCase() === "admin" && (
  <div className="text-center mt-6 mb-8">
      <div className="flex justify-center gap-4">
    <Link 
      to="/add-doctor" 
className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"    >
      ➕ Add New Doctor
    </Link>
  </div>
  </div>
)}

        <div className="container">
        <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center">Our Great Doctors</h2>
            <p className="text_para text-center">
              world-class care for everyone. our site offers unmatched expert
              health care
            </p>
          </div>
          <DoctorsList search="" />

        </div>
      </section>
      {/* faq section start */}

      <section>
        <div className="container">
          <div className="flex justify-between gap-[50px] lg:gap-0">
            <div className="w-1/2 hidden md:block">
            <img src={faqImg} alt="" />
            </div>
            <div className="w-full md:w-1/2">
            <h2 className='heading'>Most questions by our beloved patients

            </h2>
            <FaqList/>
            </div>
          </div>
        </div>
      </section>
      
<section className="my-16">
  <div className="container">
    <div className="xl:w-[470px] mx-auto mb-12">
      <div className="heading text-center">
        <h2>What Our Patients Say</h2>
        <p className="text_para text-center">
          Hear from our patients about their experiences with our healthcare services
        </p>
      </div>
    </div>
    <Testimonial />
  </div>
</section>
    </>
  );
}

export default Home;
