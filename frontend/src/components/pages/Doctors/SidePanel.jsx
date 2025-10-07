
function  SidePanel() {
  return (
    <div className='shadow-panelShadow p-3 lg:p-5 rounded-md '>
        <div className="flex items-center justify-between ">
            <p className="text_para mt-0 font-semibold">Ticket Price

            </p>
            <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">ksh 1500</span>
        </div>
        <div className="mt-30px">
          <p className="text_para mt-0 font-semibold text-headingColor">available slots</p>
          <ul className="mt-3">
            <li className="flex item-center justify-between mb-2">
              <p className="text-[15px] leading-6 text-textColor font-semibold">Sunday</p>
              <p className="text-[15px] leading-6 text-textColor font-semibold">8.00AM-9:30PM</p>
            </li>
            <li className="flex item-center justify-between mb-2">
              <p className="text-[15px] leading-6 text-textColor font-semibold">Tuesday</p>
              <p className="text-[15px] leading-6 text-textColor font-semibold">8.00AM-9:30PM</p>
            </li>
            <li className="flex item-center justify-between mb-2">
              <p className="text-[15px] leading-6 text-textColor font-semibold">Wednesday</p>
              <p className="text-[15px] leading-6 text-textColor font-semibold">8.00AM-9:30PM</p>
            </li>
          </ul>
        </div>
        <button className="btn px-2 w-full rounded-md">Appointment</button>
    </div>
  )
}

export default SidePanel 