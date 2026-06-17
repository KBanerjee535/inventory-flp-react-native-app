import {API_BASE_URL} from "../app_url";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const getHeader = async (isFormData = false) => {
  let value = JSON.parse(await AsyncStorage.getItem("flpLoginInfo"));
    let flpAuthToken = await AsyncStorage.getItem("flpAuthToken");
//alert(flpAuthToken);
  if (!flpAuthToken) {
    throw new Error("No token found in AsyncStorage");
  }

  return {
    headers: {
      Authorization: `Bearer ${flpAuthToken}`,
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json', // Dynamically set Content-Type
    },
  };
};




export const getPatientAppointmentApi = async(type) => {

//console.log(getHeader());
  return await axios.get(API_BASE_URL + `appointment/getAppointment?type=${type}`, await getHeader());
};
export const cityListApi = async (values) => {
  return await axios.post(API_BASE_URL + `patient/cityList`, values);
};

export const getMeterTypesApi = async (values) => {
  return await axios.post(API_BASE_URL + `inventory/getMeterTypes`,values, await getHeader(true));
};

export const getMunicipalityApi = async (values) => {
  return await axios.post(API_BASE_URL + `home/municipalityList`, values);
};

export const signUpApi = async (values) => {
  return await axios.post(API_BASE_URL + `patient/sign-up`, values);
};

export const forgotPasswordApi = async (values) => {
  return await axios.post(API_BASE_URL + `patient/forgot-password`, values);
};

export const updatePasswordApi = async (values) => {
  return await axios.post(API_BASE_URL + `patient/update-password`, values);
};

export const signUpSendVerificationMessageApi = async (values) => {
  return await axios.post(API_BASE_URL + `patient/signUpSendVerificationMessage`, values);
};

export const signUpVerifyAccountApi = async (values) => {
  return await axios.post(API_BASE_URL + `patient/signUpVerifyAccount`, values);
};

export const loginApi = async (values) => {
  return await axios.post(API_BASE_URL + `users/login`, values);
};

export const getInventoryListByClerkIdApi = async (values) => {
  // return await axios.post(API_BASE_URL + `clerk/InventoryListByClerkId`, values, await getHeader(true));
  return await axios.get(API_BASE_URL + `inventory/inventories/?date_from=${values.date_from}&date_to=${values.date_to}`, await getHeader(true));
};

export const InventoryListByClientIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `client/InventoryListByClientId`, values, await getHeader(true));
};

export const getInventoryDetailsApi = async (values) => {

  return await axios.post(API_BASE_URL + `clerk/InventoryDetailsByInventoryId`, values, await getHeader(true));
};

export const getSectionListByInventoryIdAPI = async (values) => {

  return await axios.post(API_BASE_URL + `clerk/SectionListByInventoryId`, values, await getHeader(true));
};

export const CreatetAcceptRejectApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/CreatetAcceptReject`, values, await getHeader(true));
};


export const ScheduleConditionsDetailsApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/ScheduleConditionsDetailsByInventoryId`, values, await getHeader(true));
};

export const ScheduleConditionsUpdateTextApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/ScheduleConditionsUpdateTextById`, values, await getHeader(true));
};



export const ScheduleConditionsUpdateAudioApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/ScheduleConditionsUpdateAudio`, values, await getHeader(true));
};


export const ScheduleConditionsDeleteAudioByIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/ScheduleConditionsDeleteAudioById`, values, await getHeader(true));
};

export const AddSectionByClerkApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/AddSectionByClerk`, values, await getHeader(true));
};

export const KeyListByInventoryIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/KeyListByInventoryId`, values, await getHeader(true));
};

export const KeyUpdateAudioApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/KeyUpdateAudio`, values, await getHeader(true));
};

export const AlarmListByInventoryIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/AlarmListByInventoryId`, values, await getHeader(true));
};

export const DeleteSectionSectionIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/DeleteSectionSectionId`, values, await getHeader(true));
};


export const sectionDetailsBySectionIdAPI = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/SectionDetailsBySectionId`, values, await getHeader(true));
};

export const SectionUpdateTextBySectionIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/SectionUpdateTextBySectionId`, values, await getHeader(true));
};

export const SectionItemUpdateTextApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/SectionItemUpdateText`, values, await getHeader(true));
};


export const SectionUpdateAudioApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/SectionUpdateAudio`, values, await getHeader(true));
};

export const SectionItemListBySectionIdAPI = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/SectionItemListBySectionId`, values, await getHeader(true));
};

export const SectionDeleteAudioBySectionIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/SectionDeleteAudioBySectionId`, values, await getHeader(true));
};

export const CleaningSummaryDetailsApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/CleaningSummaryDetailsByInventoryId`, values, await getHeader(true));
};


export const CleaningSummaryUpdateTextApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/CleaningSummaryUpdateTextById`, values, await getHeader(true));
};


export const CleaningSummaryUpdateAudioApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/CleaningSummaryUpdateAudio`, values, await getHeader(true));
};


export const CleaningSummaryDeleteAudioByIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/CleaningSummaryDeleteAudioById`, values, await getHeader(true));
};

export const DeleteAllImageByIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/CleaningSummaryDeleteImageById`, values, await getHeader(true));
};

export const SectionDeleteImageBySectionIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/SectionDeleteImageBySectionId`, values, await getHeader(true));
};


export const CleaningSummaryAddImageApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/CleaningSummaryAddImage`, values, await getHeader(true));
};


export const SectionUpdateImageBySectionIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/SectionUpdateImageBySectionId`, values, await getHeader(true));
};

export const SectionAddSupportingImageApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/SectionAddSupportingImage`, values, await getHeader(true));
};

export const GetSupportingImageBySectionIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/GetSupportingImageBySectionId`, values, await getHeader(true));
};

export const  SectionDeleteSupportingImageByIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/SectionDeleteSupportingImageById`, values, await getHeader(true));
};

export const KeyAddApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/KeyAdd`, values, await getHeader(true));
};

export const KeyUpdateApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/KeyUpdate`, values, await getHeader(true));
};

export const KeyUpdateTextByIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/KeyUpdateTextById`, values, await getHeader(true));
};

export const KeyDeleteAudioByIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/KeyDeleteAudioById`, values, await getHeader(true));
};

export const KeyAddImageApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/KeyAddImage`, values, await getHeader(true));
};

export const KeyDeleteApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/KeyDelete`, values, await getHeader(true));
};

export const KeyDetailsByKeyIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/KeyDetailsByKeyId`, values, await getHeader(true));
};

export const AlarmUpdateApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/AlarmUpdate`, values, await getHeader(true));
};
export const AlarmAddApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/AlarmAdd`, values, await getHeader(true));
};
export const AlarmDeleteApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/AlarmDelete`, values, await getHeader(true));
};
export const AlarmUpdateTextByIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/AlarmUpdateTextById`, values, await getHeader(true));
};
export const AlarmDeleteAudioByIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/AlarmDeleteAudioById`, values, await getHeader(true));
};
export const AlarmDetailsByAlarmIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/AlarmDetailsByAlarmId`, values, await getHeader(true));
};
export const AlarmAddImageApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/AlarmAddImage`, values, await getHeader(true));
};
export const AlarmUpdateAudioApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/AlarmUpdateAudio`, values, await getHeader(true));
};

export const MeterListByInventoryIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/MeterListByInventoryId`, values, await getHeader(true));
};
export const MeterUpdateApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/MeterUpdate`, values, await getHeader(true));
};
export const MeterAddApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/MeterAdd`, values, await getHeader(true));
};
export const MeterDeleteApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/MeterDelete`, values, await getHeader(true));
};
export const MeterUpdateTextByIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/MeterUpdateTextById`, values, await getHeader(true));
};
export const MeterDeleteAudioByIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/MeterDeleteAudioById`, values, await getHeader(true));
};
export const MeterDetailsByMeterIdApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/MeterDetailsByMeterId`, values, await getHeader(true));
};
export const MeterAddImageApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/MeterAddImage`, values, await getHeader(true));
};
export const MeterUpdateAudioApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/MeterUpdateAudio`, values, await getHeader(true));
};
export const allRequiredSectionsExistOrNotApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/allRequiredSectionsExistOrNot`, values, await getHeader(true));
};
export const ApproveEditedReportApi = async (values) => {
  return await axios.post(API_BASE_URL + `clerk/ApproveEditedReport`, values, await getHeader(true));
};

export const fetchNotificationApi = async () => {
  return await axios.get(API_BASE_URL + `patient/fetch-notification`, await getHeader(false));
};

export const confirmAppointmentApi = async (values) => {
  return await axios.post(API_BASE_URL + `patient/confirm-appointment`, values, await getHeader(true));
};