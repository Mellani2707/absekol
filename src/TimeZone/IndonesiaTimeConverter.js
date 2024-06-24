import moment from 'moment';
import 'moment/locale/id'; // Import locale Indonesia
export const IndonesiaTimeConverter = plainTime => {
  // Set locale to Indonesia
  moment.locale('id');
  // Contoh datetime yang akan dikonversi
  const checkIn = plainTime;
  // Konversi dan format datetime
  const formattedDate = moment(checkIn).format('LLLL');
  console.log(formattedDate); // Output: Minggu, 23 Juni 2024 08.02
  return formattedDate;
};

// Method untuk mengonversi timestamp ke hanya tanggal dengan locale Indonesia
export const IndonesiaDateOnlyConverter = plainTime => {
  // Set locale ke Indonesia
  moment.locale('id');
  // Konversi dan format hanya tanggal
  const formattedDateOnly = moment(plainTime).format('LL');
  console.log(formattedDateOnly); // Output: 23 Juni 2024
  return formattedDateOnly;
};

// Method untuk mengonversi timestamp ke hanya waktu dengan locale Indonesia
export const IndonesiaTimeOnlyConverter = plainTime => {
  // Set locale ke Indonesia
  moment.locale('id');
  // Konversi dan format hanya waktu
  const formattedTimeOnly = moment(plainTime).format('HH.mm');
  console.log(formattedTimeOnly); // Output: 08.02
  return formattedTimeOnly;
};
