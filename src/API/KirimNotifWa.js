import {
  IndonesiaDateOnlyConverter,
  IndonesiaTimeOnlyConverter,
} from '../TimeZone/IndonesiaTimeConverter';
export const KirimNotifWa = param => {
  const myHeaders = new Headers();
  myHeaders.append(
    'Authorization',
    'Bearer EABrzenWZBbf8BO8pCTRRnybpS0YHhPtVOmUe18jM9GYUqQpvBZBAFE74irxnZCZCCtof0Wbb2MN3qjL51NuV8Vmb8ogBMdRjF5ZBG7hF0SZC5ZCbFW15FNAbc96QFqEQUJ1W9EflXhQ5m1Sj0ZBgBksQP4cYd5WoWK68sppZBQ0YMMthT51FFUuCVocbN0bfSn6Ne',
  );
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    messaging_product: 'whatsapp',
    to: param.noWa,
    type: 'template',
    template: {
      name: param.status,
      language: {
        code: 'id',
      },
      components: [
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: param.nama,
            },
            {
              type: 'text',
              text: IndonesiaDateOnlyConverter(param.currentDate),
            },
            {
              type: 'text',
              text: IndonesiaTimeOnlyConverter(param.currentDate),
            },
          ],
        },
      ],
    },
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch(
    'https://graph.facebook.com/v19.0/269270049609670/messages',
    requestOptions,
  )
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.error(error));
};
