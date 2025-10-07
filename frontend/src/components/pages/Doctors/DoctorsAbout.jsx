import { FormatDate } from "../../utils/DateFormat"


function DoctorsAbout() {
  return (
   
    <div>
        <div>
            <h3 className="text-[20px] leading-[38px] text-headingColor font-semibold flex items-center gap-2">About of
            <span className="text-irisBlueColor font-bold text-[24px] leading-9">
               Jace corso 
            </span>
            </h3>
            <p className="text_para">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia impedit, necessitatibus voluptatum fugiat eligendi unde quo ipsam molestias. Necessitatibus architecto laborum, ab repellat expedita reprehenderit. Eaque tenetur architecto corporis commodi.
            </p>
          
        </div>
        <div className="mt-2">
            <h3 className="text-[20px] leading-[38px] text-headingColor font-semibold">
                Education
            </h3>
            <ul className="pt-4 md:p-5">
                <li className="flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]">
                    <div>
                        <span className="text-irisBlueColor text-[15px] leading-6 font-semibold">
                          {FormatDate('9-23-2014')}
                        </span>
                        <p className="text-[16px] leading-6 font-medium text-textColor">PHD in Surgeon</p>
                    </div>
                    <p className="text-[16px] leading-5 font-medium text-textColor">San Antonio medical , Nairobi</p>
                </li>
                <li className="flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]">
                    <div>
                        <span className="text-irisBlueColor text-[15px] leading-6 font-semibold">
                            {FormatDate('12-4-2010')}
                        </span>
                        <p className="text-[16px] leading-6 font-medium text-textColor">PHD in Surgeon</p>
                    </div>
                    <p className="text-[16px] leading-5 font-medium text-textColor">San Antonio medical , Nairobi</p>
                </li>
                <li className="flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]">
                    <div>
                        <span className="text-irisBlueColor text-[15px] leading-6 font-semibold">
                           {FormatDate('4-6-2006')}
                        </span>
                        <p className="text-[16px] leading-6 font-medium text-textColor">PHD in Surgeon</p>
                    </div>
                    <p className="text-[16px] leading-5 font-medium text-textColor">San Antonio medical , Nairobi</p>
                </li>

            </ul>

        </div>
        <div className="mt-2">
            <h3 className="text-[20px] leading-[38px] text-headingColor font-semibold">
                Experience
            </h3>
            <ul className="grid sm:grid-cols-2 gap-[30px] pt-4 md:p-5">
                <li className="p-4 rounded bg-[#fff9ea] ">
                    <span className='text-yellowColor text-[15px] leading-6 font-semibold'>
                        {FormatDate('07-04-2010')}-{FormatDate('08-13-2014')}
                    </span>
                    <p className="text-[16px] leading-6 font-medium text-textColor">Sr. Surgeon</p>
                    <p className="text-[16px] leading-6 font-medium text-textColor">New Apollo Hospital,New York</p>

                </li>
                <li className="p-4 rounded bg-[#fff9ea] ">
                    <span className='text-yellowColor text-[15px] leading-6 font-semibold'>
                        {FormatDate('07-04-2010')}-{FormatDate('08-13-2014')}
                    </span>
                    <p className="text-[16px] leading-6 font-medium text-textColor">Sr. Surgeon</p>
                    <p className="text-[16px] leading-6 font-medium text-textColor">New Apollo Hospital,New York</p>

                </li>
                
            </ul>

        </div>

    </div>
  )
}

export default DoctorsAbout