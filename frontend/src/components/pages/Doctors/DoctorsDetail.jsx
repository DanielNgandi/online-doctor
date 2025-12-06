import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import starIcon from '../../../assets/images/Star.png'
import doctorImg from '../../../assets/images/doctor-img02.png'
import DoctorsAbout from './DoctorsAbout'
import DoctorFeedback from './DoctorFeedback'
import SidePanel from './SidePanel'
import axios from 'axios'

function DoctorsDetail() {
  const [tab, setTab] = useState('about')
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { id } = useParams()


   // Add the getImageUrl function here
  const getImageUrl = (photoPath) => {
    console.log('Photo path received in DoctorsDetail:', photoPath); 
    if (!photoPath) {
      return doctorImg; // Fallback to default image
    }
    
    // If it's already a full URL, return as is
    if (photoPath.startsWith('http')) {
      return photoPath;
    }
    
    // If it starts with /uploads/, prepend with backend URL
    if (photoPath.startsWith('/uploads/')) {
      return `http://localhost:5000${photoPath}`;
    }
    
    // If it's just a filename without path, construct the full URL
    return `http://localhost:5000/uploads/${photoPath}`;
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("Fetching doctor details for ID:", id)
        
        const res = await axios.get(`http://localhost:5000/api/doctors/${id}`)
        console.log("Doctor details response:", res.data)
        setDoctor(res.data)
      } catch (error) {
        console.error("Error fetching doctor:", error)
        setError("Failed to load doctor details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchDoctor()
    }
  }, [id])

  if (loading) {
    return (
      <section>
        <div className="max-w-[1170px] px-5 mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading doctor details...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section>
        <div className="max-w-[1170px] px-5 mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (!doctor) {
    return (
      <section>
        <div className="max-w-[1170px] px-5 mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500">Doctor not found</p>
          </div>
        </div>
      </section>
    )
  }
const imageUrl = getImageUrl(doctor.photo);
  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        <div className="grid md:grid-cols-3 gap-[50px]">
          <div className="md:col-span-2">
            <div className="flex items-center gap-5">
              <figure className='max-w-[200px] max-h-[200px]'>
                <img 
                  src={imageUrl} 
                  alt={doctor.name} 
                  className='w-full h-full object-cover rounded-lg'
                  onError={(e) => {
                    console.error('❌ Image failed to load:', imageUrl);
                    e.target.src = doctorImg; // Fallback to default image
                  }}
                  onLoad={() => console.log('✅ Image loaded successfully:', imageUrl)}
                />
              </figure>
              <div>
                <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-6 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded">
                  {doctor.specialty}
                </span>
                <h3 className='text-headingColor text-[22px] leading-9 mt-3 font-bold'>
                  {doctor.name}
                </h3>
                <div className="flex items-center gap-[6px]">
                  <span className="flex items-center gap-[6px] text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-semibold text-headingColor">
                    <img src={starIcon} alt="rating" />
                    {doctor.averageRating}
                  </span>
                  <span className="text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-semibold text-textColor">
                    ({doctor.totalReviews} reviews)
                  </span>
                </div>
                <p className="text_para text-[14px] md:text-[15px] leading-5 mt-2">
                  {doctor.bio}
                </p>
                <div className="mt-3 text-textColor">
                  <p><strong>Experience:</strong> {doctor.experience} years</p>
                  <p><strong>Patients Treated:</strong> {doctor.totalPatients}+</p>
                  <p><strong>Hospital:</strong> {doctor.hospital}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-[50px] border-b border-solid border-[#0066ff34]">
              <button 
                onClick={() => setTab('about')} 
                className={`${tab === 'about' && 'border-b border-solid border-primaryColor'} py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
              >
                About
              </button>
              <button 
                onClick={() => setTab('feedback')} 
                className={`${tab === 'feedback' && 'border-b border-solid border-primaryColor'} py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
              >
                Feedback
              </button>
            </div>
            
            <div className="mt-[50px]">
              {tab === 'about' && <DoctorsAbout doctor={doctor} />}
              {tab === 'feedback' && <DoctorFeedback doctor={doctor} />}
            </div>
          </div>
          
          <div>
            <SidePanel doctor={doctor} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default DoctorsDetail