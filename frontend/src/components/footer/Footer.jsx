
import { Link } from 'react-router-dom'
  import logo from '../../assets/images/logo.png'
  import{AiFillYoutube,AiFillGithub,AiOutlineInstagram,  AiFillLinkedin} from 'react-icons/ai'

  const socialLinks=[
    {
      path:'https://www.youtube.com',
      icon:<AiFillYoutube className='group-hover:text-white w-4 h-5'/>
    },
    {
      path:'https://www.github.com',
      icon:<AiFillGithub className='group-hover:text-white w-4 h-5'/>
    },
    {
      path:'https://www.instagram.com',
      icon:<AiOutlineInstagram className='group-hover:text-white w-4 h-5'/>
    },
    {
      path:'https://www.linkedin.com',
      icon:<AiFillLinkedin className='group-hover:text-white w-4 h-5'/>
    },
  ]
  const quickLinks01=[
  
    {
      path:'/',
      display:'Home'
    },
    {
      path:'/about',
      display:'About us'
    },
    {
      path:'/services',
      display:'Services'
    },
    {
      path:'/blog',
      display:'Blog'
    },
  ]
  const quickLinks02=[
    {
      path:'/find-a-doctor',
      display:'find a doctor'
    },
    {
      path:'/',
      display:'request an appointment'
    },
    {
      path:'/',
      display:'find a location'
    },
    {
      path:'/',
      display:'get a opinion'
    }
  ]
  const quickLinks03=[
    {
      path:'/',
      display:'Donate'
    },
    {
      path:'/contact',
      display:'Contacr us'
    },
  ]
function Footer() {
 
  const year=new Date().getFullYear();
  return ( 
  
    <footer className='pb-16 pt-10'>
      <div className="container">
        <div className="flex justify-between flex-col md:flex-row flex-wrap gap-[30px]">
          <div> 
            <img src={logo} alt="" />
            <p className="text  -[16px] leading-7 font-[400] text-textColor">
              copyright ©️ {year} developed by pbogonko all right reserved
            </p>
            <div className="flex items-center gap-3 mt-4">
              {socialLinks.map((link,index)=>(
                <Link to={link.path} key={index} className=' w-9 h-9 border border-solid border-[#181A1E] rounded-full flex items-center justify-center group hover:bg-primaryColor hover:border-none'>{link.icon}</Link>
              ))}
            </div>
           
          </div>
          <div>
              <h2 className='text-[20px] leading-[30px] font-[700] mb-6 text-headingColor'>Quick links</h2>
              <ul>
                {quickLinks01.map((link,index)=>(
                  <li key={index} className='mb-4'>
                    <Link to={link.path} className='text-[16px] leading-7 font-[400] text-textColor'>{link.display}</Link>
                  </li>
                ))}
              </ul>

            </div>

            <div>
              <h2 className='text-[20px] leading-[30px] font-[700] mb-6 text-headingColor'>
                I want to:</h2>
              <ul>
                {quickLinks02.map((link,index)=>(
                  <li key={index} className='mb-4'>
                    <Link to={link.path} className='text-[16px] leading-7 font-[400] text-textColor'>{link.display}</Link>
                  </li>
                ))}
              </ul>

            </div>

            <div>
              <h2 className='text-[20px] leading-[30px] font-[700] mb-6 text-headingColor'>
                Support</h2>
              <ul>
                {quickLinks03.map((link,index)=>(
                  <li key={index} className='mb-4'>
                    <Link to={link.path} className='text-[16px] leading-7 font-[400] text-textColor'>{link.display}</Link>
                  </li>
                ))}
              </ul>

            </div>
        </div>
      </div>

    </footer>
  )
}

export default Footer