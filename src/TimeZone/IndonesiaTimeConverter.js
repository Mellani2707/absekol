import moment from 'moment';
import 'moment/locale/id'; // Import locale Indonesia
export const IndonesiaTimeConverter = plainTime => {
  // Set locale to Indonesia
  moment.locale('id');
  // Contoh datetime yang akan dikonversi
  const checkIn = plainTime;
  // Konversi dan format datetime
  const formattedDate = moment(checkIn).format('LLLL');
  console.log(
    '==============Mooment Time Zone Indonesian Converter======================',
  );
  console.log(formattedDate);
  console.log('====================================');
  console.log(formattedDate); // Output: Minggu, 23 Juni 2024 08.02
  return formattedDate;
};
