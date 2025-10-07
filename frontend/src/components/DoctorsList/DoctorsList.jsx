
//import {doctors} from '../../assets/data/doctors'
import DoctorCard from './DoctorCard'
import { useEffect, useState } from "react";
import axios from "axios";

function DoctorsList({ search }) {
    const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/doctors`, {
          params: { search }
        });
        setDoctors(res.data);
      } catch (error) {
        console.error("Error fetching doctors", error);
      }
    };
    fetchDoctors();
  }, [search]);

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt=[55px]'>
         {doctors.map((doctor)=>
         <DoctorCard key={doctor.id} doctor={doctor}/>)}
    </div>

  )
}

export default DoctorsList