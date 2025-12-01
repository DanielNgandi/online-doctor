import DoctorCard from './DoctorCard'
import { useEffect, useState } from "react";
import axios from "axios";

function DoctorsList({ search }) {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                setError(null);
                
                console.log("Fetching doctors with search:", search);
                
                const res = await axios.get(`http://localhost:5000/api/doctors`, {
                    params: { 
                        search: search || '' 
                    }
                });
                
                console.log("Doctors response:", res.data); 
                setDoctors(res.data);
                
            } catch (error) {
                console.error("Error fetching doctors", error);
                setError("Failed to load doctors. Please try again.");
                setDoctors([]);
            } finally {
                setLoading(false);
            }
        };
        
        
        fetchDoctors();
        
    }, [search]); // This will refetch when search changes

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading doctors...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="text-red-500 mb-2">{error}</div>
                <button 
                    onClick={() => window.location.reload()} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {doctors.length > 0 ? (
                doctors.map((doctor) => 
                    <DoctorCard key={doctor.id} doctor={doctor}/>
                )
            ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                    {search ? `No doctors found for "${search}"` : "No doctors available"}
                </div>
            )}
        </div>
    );
}

export default DoctorsList;