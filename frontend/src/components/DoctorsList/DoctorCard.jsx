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
  return (
    <div className="p-4 lg:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      {/* Doctor Image */}
      <div className="flex justify-center mb-4">
        <img 
          src={photo} 
          alt={name}
          className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-primaryColor/10"
        />
      </div>

      {/* Doctor Name */}
      <h2 className="text-xl lg:text-2xl text-headingColor font-bold text-center mb-3">
        {name}
      </h2>

      {/* Specialty and Rating */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 mb-4">
        <span className="bg-[#CCF0F3] text-irisBlueColor py-2 px-4 lg:px-6 text-sm lg:text-base font-semibold rounded-full">
          {specialty}
        </span>
        
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full">
          <span className="flex items-center gap-2 text-headingColor font-semibold">
            <img src={starIcon} alt="Rating" className="w-4 h-4" />
            {avgRating}
          </span>
          <span className="text-sm text-textColor">
            ({totalRating} reviews)
          </span>
        </div>
      </div>

      {/* Patients and Hospital Info */}
      <div className="space-y-3 mb-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-headingColor">
            +{totalPatients} patients
          </h3>
          <p className="text-textColor mt-1">
            At {hospital}
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
