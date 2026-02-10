import DoctorCard from './DoctorCard'
import { useEffect, useState } from "react";
import axios from "axios";

function DoctorsList({ search }) {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctors = async () => {
    //         try {
    //             setLoading(true);
    //             setError(null);
                
    //             console.log("Fetching doctors with search:", search);
                
    //             const res = await axios.get(`http://localhost:5000/api/doctors`, {
    //                 params: { 
    //                     search: search || '' 
    //                 }
    //             });
                
    //             console.log("Doctors response:", res.data);
    //             console.log("✅ API Response received:");
    //             console.log("📊 Response data type:", typeof res.data);
    //             console.log("📊 Is array?", Array.isArray(res.data));
    //             console.log("📊 Response data:", res.data); 

    //               // Check the first doctor's data structure
    //             if (res.data && Array.isArray(res.data) && res.data.length > 0) {
    //                 console.log("🔬 First doctor details:", {
    //                     id: res.data[0].id,
    //                     name: res.data[0].name,
    //                     avgRating: res.data[0].avgRating,
    //                     totalRating: res.data[0].totalRating,
    //                     totalPatients: res.data[0].totalPatients,
    //                     // List all keys to see what's available
    //                     allKeys: Object.keys(res.data[0])
    //                 });
                    
    //                 // Check if we have testimonials data
    //                 if (res.data[0].testimonials) {
    //                     console.log("📝 First doctor has testimonials:", res.data[0].testimonials);
    //                 }
                    
    //                 // Check all doctors for rating data
    //                 res.data.forEach((doctor, index) => {
    //                     console.log(`👨‍⚕️ Doctor ${index + 1}: ${doctor.name}`, {
    //                         avgRating: doctor.avgRating,
    //                         totalRating: doctor.totalRating,
    //                         hasAvgRating: 'avgRating' in doctor,
    //                         hasTotalRating: 'totalRating' in doctor,
    //                         ratingFields: {
    //                             avgRating: doctor.avgRating,
    //                             averageRating: doctor.averageRating,
    //                             totalRating: doctor.totalRating,
    //                             totalReviews: doctor.totalReviews,
    //                             totalRating: doctor.totalRating
    //                         }
    //                     });
    //                 });
    //             }
    //             setDoctors(res.data);
                
    //         } catch (error) {
    //             console.error("Error fetching doctors", error);
    //             setError("Failed to load doctors. Please try again.");
    //             setDoctors([]);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
        
        
    //     fetchDoctors();
        
    // }, [search]); // This will refetch when search changes

     try {
        setLoading(true);
        setError(null);

        console.log("Fetching doctors with search:", search);

        const res = await api.get('/api/doctors', {
          params: { search: search || '' }
        });

        const data = res?.data || [];
        console.log("✅ API Response received:", data);

        // Optional: log the first doctor's structure for debugging
        if (Array.isArray(data) && data.length > 0) {
          console.log("🔬 First doctor details:", {
            id: data[0]?.id,
            name: data[0]?.name,
            avgRating: data[0]?.avgRating,
            totalRating: data[0]?.totalRating,
            totalPatients: data[0]?.totalPatients,
            allKeys: Object.keys(data[0] || {})
          });
        }

        setDoctors(data);

      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors. Please try again.");
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [search]);

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