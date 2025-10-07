
import ServiceCard from '../services/ServiceCard'
import {services} from '../../assets/data/services'
function Services() {
  return (
  <section>
    <div className="container">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
        {services.map((service,index)=>(
          <ServiceCard item={service} key={index} index={index}/>
        ))}
       </div>
    </div>
  </section>
  )
}

export default Services