import './WeekCard.css'
export const WeekEeventsCard = ({color,calen,num}) => {
  return (
    <div className='WeekEeventsCard flex-column gap-1 gap-md-2 flex-wrap flex-md-row d-flex justify-content-center align-items-center' style={{backgroundColor:`${color}`}}>
        <div  ><h3 className='text-white m-0 fw-bold '>{num}</h3></div>
        <div className='justify-content-center  flex-md-row flex-column gap-1 align-items-center d-flex l '>
        <div ><h5 className='text-white fw-bold  m-0 '>{calen}</h5>  </div>
        <div  ><h6  className='text-white   m-0 fs-5 fw-normal '> events</h6></div>

        </div>
    </div>
  )
}
