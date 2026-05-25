import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import ClientTabRoutes from "./ClientTabRoutes";
import ClerkInspectionScreen from "../screens/ClerkInspectionScreen";
import TasksDetailsScreen from "../screens/SnaggingTasksDetailsScreen";
import ClerkSnaggingCTReportDetails from "../screens/ClerkSnaggingCTReportDetails";
import ClerkSnagginginspectionrecord from "../screens/ClerkSnagginginspectionrecord";
import ClerkSnagginginspectionrecordText from "../screens/ClerkSnagginginspectionrecordText";
import ClerkSnagginginspectionrecordAudio from "../screens/ClerkSnagginginspectionrecordAudio";
import ClerkScheduleConditions from "../screens/ClerkScheduleConditions";
import ClerkScheduleConditionAddText from "../screens/ClerkScheduleConditionAddText";
import ClerkScheduleConditionAddAudio from "../screens/ClerkScheduleConditionAddAudio";
import ClerkCleaningSummary from "../screens/ClerkCleaningSummary";
import ClerkCleaningSummaryAddText from "../screens/ClerkCleaningSummaryAddText";
import ClerkCleaningSummaryAddAudio from "../screens/ClerkCleaningSummaryAddAudio";
import ClerkAddKey from "../screens/ClerkAddKey";
import ClerkAddKeyAddText from "../screens/ClerkAddKeyAddText";
import ClerkAddKeyAddAudio from "../screens/ClerkAddKeyAddAudio";
import ClerkKeysList from "../screens/ClerkKeysList";
import ClerkAddAlarm from "../screens/ClerkAddAlarm";
import ClerkAddAlarmAddText from "../screens/ClerkAddAlarmAddText";
import ClerkAddAlarmAddAudio from "../screens/ClerkAddAlarmAddAudio";
import ClerkAlarmList from "../screens/ClerkAlarmList";
import ClerkAddMeter from "../screens/ClerkAddMeter";
import ClerkAddMeterAddText from "../screens/ClerkAddMeterAddText";
import ClerkAddMeterAddAudio from "../screens/ClerkAddMeterAddAudio";
import ClerkMetersList from "../screens/ClerkMetersList";
import ClerkAddBedroomDetails from "../screens/ClerkAddBedroomDetails";
import ClerkAddBedroomDetailsAddText from "../screens/ClerkAddBedroomDetailsAddText";
import ClerkAddBedroomDetailsAddAudio from "../screens/ClerkAddBedroomDetailsAddAudio";
import ClientTaskDetails from "../screens/ClientTaskDetails";
import ClientWaitingforapprovalfeedbackReportDetails from "../screens/ClientWaitingforapprovalfeedbackReportDetails";
import ClientWaitingforapprovalfeedbackReportSOC from "../screens/ClientWaitingforapprovalfeedbackReportSOC";
import ClientWaitingforapprovalfeedbackCleaning from "../screens/ClientWaitingforapprovalfeedbackCleaning";
import ClientWaitingforapprovalfeedbackReportkeys from "../screens/ClientWaitingforapprovalfeedbackReportkeys";
import ClientWaitingforapprovalfeedback_Keysdetails from "../screens/ClientWaitingforapprovalfeedback_Keysdetails";
import ClientWaitingforapprovalfeedbackReportAlarms from "../screens/ClientWaitingforapprovalfeedbackReportAlarms";
import ClientWaitingforapprovalfeedbackAlarmsDetails from "../screens/ClientWaitingforapprovalfeedbackAlarmsDetails";
import ClientWaitingforapprovalfeedbackMeters from "../screens/ClientWaitingforapprovalfeedbackMeters";
import ClientWaitingforapprovalfeedbackMeterDetails from "../screens/ClientWaitingforapprovalfeedbackMeterDetails";
import ClientWaitingforapprovalfeedbackBedroom from "../screens/ClientWaitingforapprovalfeedbackBedroom";
import ClientWaitingforapprovalfeedbackBedroomDetails from "../screens/ClientWaitingforapprovalfeedbackBedroomDetails";
import ClientReAssignedTaskDetails from "../screens/ClientReAssignedTaskDetails";
import AddTenant from "../screens/AddTenant";
import ClerkInventoryFilter from "../screens/ClerkInventoryFilter";
import EditAccount from "../screens/EditAccount";
import ChangePassword from "../screens/ChangePassword";
import ClerkInventoryAssignedTasksDetails from "../screens/ClerkInventoryAssignedTasksDetails";
import ClerkInventoryUpcomingTasksDetails from "../screens/ClerkInventoryUpcomingTasksDetails";
import ClerkInventoryCompletedTasksDetails from "../screens/ClerkInventoryCompletedTasksDetails";
import ClerkInventoryCompletedTasksReportDetails from "../screens/ClerkInventoryCompletedTasksReportDetails";
import ClerkInventoryCompletedTasksReportSOC from "../screens/ClerkInventoryCompletedTasksReportSOC";
import ClerkInventoryCompletedTasksReportCleaning from "../screens/ClerkInventoryCompletedTasksReportCleaning";
import ClerkInventoryCompletedTasksReportKeyslist from "../screens/ClerkInventoryCompletedTasksReportKeyslist";
import ClerkInventoryCompletedTasksReportKeysDetails from "../screens/ClerkInventoryCompletedTasksReportKeysDetails";
import ClerkInventoryCompletedTasksReportAlarmlist from "../screens/ClerkInventoryCompletedTasksReportAlarmlist";
import ClerkInventoryCompletedTasksReportAlarmDetails from "../screens/ClerkInventoryCompletedTasksReportAlarmDetails";
import ClerkInventoryCompletedTasksReportMeterlist from "../screens/ClerkInventoryCompletedTasksReportMeterlist";
import ClerkInventoryCompletedTasksReportMeterDetails from "../screens/ClerkInventoryCompletedTasksReportMeterDetails";
import ClerkInventoryCompletedTasksReportBedroomlist from "../screens/ClerkInventoryCompletedTasksReportBedroomlist";
import ClerkInventoryCompletedTasksReportBedroomDetails from "../screens/ClerkInventoryCompletedTasksReportBedroomDetails";
import ClerkInventoryWaitingforApprovalTaskDetails from "../screens/ClerkInventoryWaitingforApprovalTaskDetails";
import ClerkInventoryApprovedTaskDetails from "../screens/ClerkInventoryApprovedTaskDetails";
import ClerkInventoryWaitingforapproval from "../components/ClerkInventoryWaitingforapproval";
import ClerkInventoryWaitingforApprovalReportDetails from "../screens/ClerkInventoryWaitingforApprovalReportDetails";
import ClerkInventoryWaitingforapprovalReportSOC from "../screens/ClerkInventoryWaitingforapprovalReportSOC";
import ClerkInventoryWaitingforapprovalReportCleaning from "../screens/ClerkInventoryWaitingforapprovalReportCleaning";
import ClerkInventoryWaitingforApprovalReportkeys from "../screens/ClerkInventoryWaitingforApprovalReportkeys";
import ClerkInventoryWaitingforApprovalReportkeysdetails from "../screens/ClerkInventoryWaitingforApprovalReportkeysdetails";
import ClerkInventoryWaitingforApprovalReportAlarms from "../screens/ClerkInventoryWaitingforApprovalReportAlarms";
import ClerkInventoryWaitingforApprovalReportAlarmsDetails from "../screens/ClerkInventoryWaitingforApprovalReportAlarmsDetails";
import ClerkInventoryWaitingforApprovalReportMeters from "../screens/ClerkInventoryWaitingforApprovalReportMeters";
import ClerkInventoryWaitingforApprovalReportMetersDetails from "../screens/ClerkInventoryWaitingforApprovalReportMetersDetails";
import ClerkInventoryWaitingforApprovalReportBedroom from "../screens/ClerkInventoryWaitingforApprovalReportBedroom";
import ClerkInventoryWaitingforApprovalReportBedroomDetails from "../screens/ClerkInventoryWaitingforApprovalReportBedroomDetails";
import SnaggingTasksDetailsScreen from "../screens/SnaggingTasksDetailsScreen";
import ClientInvoiceInfoScreen from "../screens/ClientInvoiceInfoScreen";
import HistoricalTaskDetails from "../screens/HistoricalTaskDetails";
import TabRoutes from "./TabRoutes";
import { useUserContext } from "../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import AddNewSection from "../screens/AddNewSection";
import ClerkCleaningSummaryList from "../screens/ClerkCleaningSummaryList";
import Addanother from "../screens/Addanother";
import AddGeneralNotes from "../screens/AddGeneralNotes";

const Stack = createNativeStackNavigator();

function Router() {
  const { isLoggedIn, setIsLoggedIn, userType, setuserType } = useUserContext();
  const [loading, setLoading] = useState(true); // Added state to handle initial check
  useEffect(() => {
    const checkUserInfo = async () => {
      const userData = await AsyncStorage.getItem("flpLoginInfo");
      setIsLoggedIn(!!userData); // Update login state
      setuserType(JSON.parse(userData)?.user_type);
      // alert(JSON.parse(userData).user_type);
      //userType === '4' ? 'ClientTabRoutes' :userType === '4'?'TabRoutes':'Welcome'
      setLoading(false); // Mark loading as complete
    };

    checkUserInfo();
  }, []);

  const parsedUserType = parseInt(userType, 10);

  if (loading) return null;

  return (
    <Stack.Navigator
      initialRouteName={
        parsedUserType === 4
          ? "ClientTabRoutes"
          : parsedUserType === 6
          ? "TabRoutes"
          : "Welcome"
      }
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="TabRoutes" component={TabRoutes} />
      <Stack.Screen name="ClerkInspection" component={ClerkInspectionScreen} />
      <Stack.Screen
        name="SnaggingTasksDetails"
        component={SnaggingTasksDetailsScreen}
      />
      <Stack.Screen
        name="ClerkSnaggingCTReportDetails"
        component={ClerkSnaggingCTReportDetails}
      />
      <Stack.Screen
        name="ClerkSnagginginspectionrecord"
        component={ClerkSnagginginspectionrecord}
      />
      <Stack.Screen
        name="ClerkSnagginginspectionrecordText"
        component={ClerkSnagginginspectionrecordText}
      />
      <Stack.Screen
        name="ClerkSnagginginspectionrecordAudio"
        component={ClerkSnagginginspectionrecordAudio}
      />

      <Stack.Screen
        name="ClerkScheduleConditions"
        component={ClerkScheduleConditions}
      />
      <Stack.Screen
        name="ClerkScheduleConditionAddText"
        component={ClerkScheduleConditionAddText}
      />
      <Stack.Screen
        name="ClerkScheduleConditionAddAudio"
        component={ClerkScheduleConditionAddAudio}
      />
      <Stack.Screen
        name="ClerkCleaningSummary"
        component={ClerkCleaningSummary}
      />
      <Stack.Screen
        name="ClerkCleaningSummaryAddText"
        component={ClerkCleaningSummaryAddText}
      />
      <Stack.Screen
        name="ClerkCleaningSummaryAddAudio"
        component={ClerkCleaningSummaryAddAudio}
      />
      <Stack.Screen name="ClerkAddKey" component={ClerkAddKey} />
      <Stack.Screen name="ClerkAddKeyAddText" component={ClerkAddKeyAddText} />
      <Stack.Screen
        name="ClerkAddKeyAddAudio"
        component={ClerkAddKeyAddAudio}
      />
      <Stack.Screen name="ClerkKeysList" component={ClerkKeysList} />
      <Stack.Screen name="ClerkAddAlarm" component={ClerkAddAlarm} />
      <Stack.Screen
        name="ClerkAddAlarmAddText"
        component={ClerkAddAlarmAddText}
      />
      <Stack.Screen
        name="ClerkAddAlarmAddAudio"
        component={ClerkAddAlarmAddAudio}
      />
      <Stack.Screen name="ClerkAlarmList" component={ClerkAlarmList} />
      <Stack.Screen name="ClerkAddMeter" component={ClerkAddMeter} />
      <Stack.Screen
        name="ClerkAddMeterAddText"
        component={ClerkAddMeterAddText}
      />
      <Stack.Screen
        name="ClerkAddMeterAddAudio"
        component={ClerkAddMeterAddAudio}
      />
      <Stack.Screen name="ClerkMetersList" component={ClerkMetersList} />
      <Stack.Screen
        name="ClerkAddBedroomDetails"
        component={ClerkAddBedroomDetails}
      />
      <Stack.Screen
        name="ClerkAddBedroomDetailsAddText"
        component={ClerkAddBedroomDetailsAddText}
      />
      <Stack.Screen
        name="ClerkAddBedroomDetailsAddAudio"
        component={ClerkAddBedroomDetailsAddAudio}
      />

      {/* Client Link */}

      <Stack.Screen name="ClientTabRoutes" component={ClientTabRoutes} />
      <Stack.Screen name="ClientTaskDetails" component={ClientTaskDetails} />
      <Stack.Screen
        name="ClientWaitingforapprovalfeedbackReportDetails"
        component={ClientWaitingforapprovalfeedbackReportDetails}
      />
      <Stack.Screen
        name="ClientWaitingforapprovalfeedbackReportSOC"
        component={ClientWaitingforapprovalfeedbackReportSOC}
      />
      <Stack.Screen
        name="ClientWaitingforapprovalfeedbackCleaning"
        component={ClientWaitingforapprovalfeedbackCleaning}
      />
      <Stack.Screen
        name="ClientWaitingforapprovalfeedbackReportkeys"
        component={ClientWaitingforapprovalfeedbackReportkeys}
      />
      <Stack.Screen
        name="ClientWaitingforapprovalfeedbackKeysdetails"
        component={ClientWaitingforapprovalfeedback_Keysdetails}
      />
      <Stack.Screen
        name="ClientWaitingforapprovalfeedbackReportAlarms"
        component={ClientWaitingforapprovalfeedbackReportAlarms}
      />
      <Stack.Screen
        name="ClientWaitingforapprovalfeedbackAlarmsDetails"
        component={ClientWaitingforapprovalfeedbackAlarmsDetails}
      />
      <Stack.Screen
        name="ClientWaitingforapprovalfeedbackMeters"
        component={ClientWaitingforapprovalfeedbackMeters}
      />
      <Stack.Screen
        name="ClientWaitingforapprovalfeedbackMeterDetails"
        component={ClientWaitingforapprovalfeedbackMeterDetails}
      />
      <Stack.Screen
        name="ClientWaitingforapprovalfeedbackBedroom"
        component={ClientWaitingforapprovalfeedbackBedroom}
      />

      <Stack.Screen
        name="ClientWaitingforapprovalfeedbackBedroomDetails"
        component={ClientWaitingforapprovalfeedbackBedroomDetails}
      />

      <Stack.Screen
        name="ClientReAssignedTaskDetails"
        component={ClientReAssignedTaskDetails}
      />
      <Stack.Screen name="AddTenant" component={AddTenant} />
      <Stack.Screen
        name="ClerkInventoryFilter"
        component={ClerkInventoryFilter}
      />
      <Stack.Screen name="EditAccount" component={EditAccount} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen
        name="ClerkInventoryAssignedTasksDetails"
        component={ClerkInventoryAssignedTasksDetails}
      />
      <Stack.Screen
        name="ClerkInventoryUpcomingTasksDetails"
        component={ClerkInventoryUpcomingTasksDetails}
      />
      <Stack.Screen
        name="ClerkInventoryCompletedTasksDetails"
        component={ClerkInventoryCompletedTasksDetails}
      />

      <Stack.Screen
        name="ClerkInventoryCompletedTasksReportDetails"
        component={ClerkInventoryCompletedTasksReportDetails}
      />

      <Stack.Screen
        name="ClerkInventoryCompletedTasksReportSOC"
        component={ClerkInventoryCompletedTasksReportSOC}
      />

      <Stack.Screen
        name="ClerkInventoryCompletedTasksReportCleaning"
        component={ClerkInventoryCompletedTasksReportCleaning}
      />

      <Stack.Screen
        name="ClerkInventoryCompletedTasksReportKeyslist"
        component={ClerkInventoryCompletedTasksReportKeyslist}
      />

      <Stack.Screen
        name="ClerkInventoryCompletedTasksReportKeysDetails"
        component={ClerkInventoryCompletedTasksReportKeysDetails}
      />

      <Stack.Screen
        name="ClerkInventoryCompletedTasksReportAlarmlist"
        component={ClerkInventoryCompletedTasksReportAlarmlist}
      />

      <Stack.Screen
        name="ClerkInventoryCompletedTasksReportAlarmDetails"
        component={ClerkInventoryCompletedTasksReportAlarmDetails}
      />

      <Stack.Screen
        name="ClerkInventoryCompletedTasksReportMeterlist"
        component={ClerkInventoryCompletedTasksReportMeterlist}
      />

      <Stack.Screen
        name="ClerkInventoryCompletedTasksReportMeterDetails"
        component={ClerkInventoryCompletedTasksReportMeterDetails}
      />

      <Stack.Screen
        name="ClerkInventoryCompletedTasksReportBedroomlist"
        component={ClerkInventoryCompletedTasksReportBedroomlist}
      />
      <Stack.Screen
        name="ClerkInventoryCompletedTasksReportBedroomDetails"
        component={ClerkInventoryCompletedTasksReportBedroomDetails}
      />

      <Stack.Screen
        name="ClerkInventoryWaitingforApprovalTaskDetails"
        component={ClerkInventoryWaitingforApprovalTaskDetails}
      />

      <Stack.Screen
        name="ClerkInventoryApprovedTaskDetails"
        component={ClerkInventoryApprovedTaskDetails}
      />

      <Stack.Screen
        name="ClerkInventoryWaitingforApprovalReportDetails"
        component={ClerkInventoryWaitingforApprovalReportDetails}
      />

      <Stack.Screen
        name="ClerkInventoryWaitingforapprovalReportSOC"
        component={ClerkInventoryWaitingforapprovalReportSOC}
      />

      <Stack.Screen
        name="ClerkInventoryWaitingforapprovalReportCleaning"
        component={ClerkInventoryWaitingforapprovalReportCleaning}
      />

      <Stack.Screen
        name="ClerkInventoryWaitingforApprovalReportkeys"
        component={ClerkInventoryWaitingforApprovalReportkeys}
      />

      <Stack.Screen
        name="ClerkInventoryWaitingforApprovalReportkeysdetails"
        component={ClerkInventoryWaitingforApprovalReportkeysdetails}
      />

      <Stack.Screen
        name="ClerkInventoryWaitingforApprovalReportAlarms"
        component={ClerkInventoryWaitingforApprovalReportAlarms}
      />

      <Stack.Screen
        name="ClerkInventoryWaitingforApprovalReportAlarmsDetails"
        component={ClerkInventoryWaitingforApprovalReportAlarmsDetails}
      />

      <Stack.Screen
        name="ClerkInventoryWaitingforApprovalReportMeters"
        component={ClerkInventoryWaitingforApprovalReportMeters}
      />

      <Stack.Screen
        name="ClerkInventoryWaitingforApprovalReportMetersDetails"
        component={ClerkInventoryWaitingforApprovalReportMetersDetails}
      />

      <Stack.Screen
        name="ClerkInventoryWaitingforApprovalReportBedroom"
        component={ClerkInventoryWaitingforApprovalReportBedroom}
      />

      <Stack.Screen
        name="ClerkInventoryWaitingforApprovalReportBedroomDetails"
        component={ClerkInventoryWaitingforApprovalReportBedroomDetails}
      />

      <Stack.Screen
        name="ClientInvoiceInfoScreen"
        component={ClientInvoiceInfoScreen}
      />
      <Stack.Screen
        name="HistoricalTaskDetails"
        component={HistoricalTaskDetails}
      />

      <Stack.Screen name="AddNewSection" component={AddNewSection} />

      <Stack.Screen
        name="ClerkCleaningSummaryList"
        component={ClerkCleaningSummaryList}
      />

      <Stack.Screen name="Addanother" component={Addanother} />

      <Stack.Screen name="AddGeneralNotes" component={AddGeneralNotes} />
    </Stack.Navigator>
  );
}

export default Router;
