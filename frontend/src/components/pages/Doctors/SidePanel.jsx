function SidePanel({ doctor }) {
  const { ticketPrice = 0, timeSlots = [] } = doctor

  return (
    <div className='shadow-panelShadow p-3 lg:p-5 rounded-md'>
      <div className="flex items-center justify-between">
        <p className="text_para mt-0 font-semibold">Ticket Price</p>
        <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
          KSH {ticketPrice}
        </span>
      </div>
      
      {timeSlots.length > 0 ? (
        <div className="mt-6">
          <p className="text_para mt-0 font-semibold text-headingColor">Available Slots</p>
          <ul className="mt-3">
            {timeSlots.map((slot, index) => (
              <li key={index} className="flex items-center justify-between mb-2">
                <p className="text-[15px] leading-6 text-textColor font-semibold">{slot.day}</p>
                <p className="text-[15px] leading-6 text-textColor font-semibold">{slot.time}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-6">
          <p className="text_para mt-0 font-semibold text-headingColor">Available Slots</p>
          <p className="text-[14px] text-textColor mt-2">Please contact for appointment availability</p>
        </div>
      )}
      
      <button className="btn px-2 w-full rounded-md mt-6">Book Appointment</button>
    </div>
  )
}

export default SidePanel