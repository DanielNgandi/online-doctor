import {faqs} from '../../assets/data/faqs'
import FaqItem from './FaqItem'

function FaqList() {
  return (
    <ul>
        {faqs.map((faq,index)=>
        <FaqItem item={faq} key={index}/>
        )}
    </ul>
  )
}

export default FaqList