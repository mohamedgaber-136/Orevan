import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {useParams } from 'react-router-dom'

export const BreadCrumbs = ({sub}) => {
    let {id} = useParams()

    const breadcrumbs = [
        <h6 className='text-secondary fw-bolder m-0 ' key={2} >
          {sub}
        </h6>,
        <h6
        className='text-secondary fw-bolder m-0' key={1}
        >
          #{id} {}
        </h6>]
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {breadcrumbs}
    </Breadcrumbs>
  )
}
