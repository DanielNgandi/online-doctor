/* eslint-disable react/prop-types */
import { BsArrowRight } from "react-icons/bs";
import starIcon from "../../assets/images/Star.png";
import { Link } from "react-router-dom";

function DoctorCard({ doctor }) {
  const {
    name,
    specialty,
    avgRating,
    totalRating,
    photo,
    totalPatients,
    hospital,
  } = doctor;
  console.log('Doctor data:', doctor); 
  const getImageUrl = (photoPath) => {
    console.log('Photo path received:', photoPath); 
    if (!photoPath) {
      
      return null;
    }
    
    
    if (photoPath.startsWith('http')) {
      return photoPath;
    }
    
    
    if (photoPath.startsWith('/uploads/')) {
      return `http://localhost:5000${photoPath}`;
    }
    
    
    return `http://localhost:5000/uploads/${photoPath}`;
  };

const imageUrl = getImageUrl(photo);


  return (
    <div className="p-4 lg:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      {/* Doctor Image */}
      <div className="flex justify-center mb-4">
        {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={name}
          onError={(e) => {
              console.error('❌ Image failed to load:', imageUrl);
              // Replace with initial avatar on error
              e.target.style.display = 'none';
            }}
            onLoad={() => console.log('✅ Image loaded successfully:', imageUrl)}
          className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-primaryColor/10"
        />
          ) : (
      <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gray-200 border-4 border-primaryColor/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-500">
              {name?.charAt(0)?.toUpperCase() || 'D'}
            </span>
          </div>
        )}
      </div>
      {/* Specialty and Rating */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 mb-4">
        <span className="bg-[#CCF0F3] text-irisBlueColor py-2 px-4 lg:px-6 text-sm lg:text-base font-semibold rounded-full">
          {specialty}
        </span>
        
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full">
          <span className="flex items-center gap-2 text-headingColor font-semibold">
            <img src={starIcon} alt="Rating" className="w-4 h-4" />
            {avgRating || 0}
          </span>
          <span className="text-sm text-textColor">
            ({totalRating || 0} reviews)
          </span>
        </div>
      </div>

      {/* Patients and Hospital Info */}
      <div className="space-y-3 mb-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-headingColor">
            +{totalPatients || 0} patients
          </h3>
          <p className="text-textColor mt-1">
            At {hospital || 'Not specified'}
          </p>
        </div>
      </div>

      {/* View Profile Button */}
      <div className="flex justify-center">
        <Link
          to={`/doctors/${doctor.id}`}
          className="flex items-center gap-2 bg-primaryColor text-white py-3 px-6 rounded-full font-semibold hover:bg-primaryColor/90 transition-colors duration-300 group"
        >
          View Profile
          <BsArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
}

export default DoctorCard;