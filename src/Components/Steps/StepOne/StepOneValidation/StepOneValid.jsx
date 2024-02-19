import * as Yup from 'yup'
export const StepOneValidation = Yup.object({
    EventName:Yup.string().min(3).required('required Data'),
    CostperDelegate:Yup.number().min(1).required('required Data'),
    PO:Yup.number().min(1).required('required Data'),
    Franchise:Yup.string().min(3).required('required Data'),
    City:[],
    P3:Yup.number().min(1).required('required Data'),
    TransferOfValue:[],
    CreatedAt:Yup.string().min(3).required('required Data'),
    EndDate:Yup.string().min(3).required('required Data'),
    DateFromHours:Yup.string().min(3).required('required Data'),
    DateEndHours:Yup.string().min(3).required('required Data'),
})