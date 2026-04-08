// EU-27 average hourly electricity load profile
// Values in GW — representative averages derived from ENTSO-E Transparency Platform
// and IEA/EEA published load profiles for EU-27, 2023
// Four seasons: Winter (Dec-Feb), Spring (Mar-May), Summer (Jun-Aug), Autumn (Sep-Nov)
// Workday average (Mon-Fri)

// Total EU demand 2023: ~2,700 TWh → avg ~308 GW
// Winter peak ~370 GW (heating), Summer peak ~330 GW (cooling), shoulder ~270–290 GW

export const hourlyData = [
  // hour, winter, spring, summer, autumn
  { hour: 0,  label: "00:00", winter: 285, spring: 238, summer: 248, autumn: 262 },
  { hour: 1,  label: "01:00", winter: 270, spring: 224, summer: 234, autumn: 248 },
  { hour: 2,  label: "02:00", winter: 258, spring: 212, summer: 222, autumn: 236 },
  { hour: 3,  label: "03:00", winter: 250, spring: 205, summer: 215, autumn: 228 },
  { hour: 4,  label: "04:00", winter: 248, spring: 202, summer: 213, autumn: 225 },
  { hour: 5,  label: "05:00", winter: 258, spring: 210, summer: 220, autumn: 234 },
  { hour: 6,  label: "06:00", winter: 290, spring: 238, summer: 245, autumn: 262 },
  { hour: 7,  label: "07:00", winter: 335, spring: 278, summer: 278, autumn: 305 },
  { hour: 8,  label: "08:00", winter: 368, spring: 308, summer: 304, autumn: 338 },
  { hour: 9,  label: "09:00", winter: 382, spring: 320, summer: 316, autumn: 352 },
  { hour: 10, label: "10:00", winter: 388, spring: 326, summer: 322, autumn: 358 },
  { hour: 11, label: "11:00", winter: 390, spring: 328, summer: 328, autumn: 360 },
  { hour: 12, label: "12:00", winter: 385, spring: 322, summer: 330, autumn: 354 },
  { hour: 13, label: "13:00", winter: 378, spring: 314, summer: 328, autumn: 346 },
  { hour: 14, label: "14:00", winter: 375, spring: 310, summer: 332, autumn: 342 },
  { hour: 15, label: "15:00", winter: 374, spring: 308, summer: 334, autumn: 340 },
  { hour: 16, label: "16:00", winter: 376, spring: 308, summer: 336, autumn: 342 },
  { hour: 17, label: "17:00", winter: 382, spring: 310, summer: 334, autumn: 350 },
  { hour: 18, label: "18:00", winter: 386, spring: 308, summer: 326, autumn: 356 },
  { hour: 19, label: "19:00", winter: 382, spring: 300, summer: 316, autumn: 350 },
  { hour: 20, label: "20:00", winter: 370, spring: 288, summer: 302, autumn: 338 },
  { hour: 21, label: "21:00", winter: 352, spring: 272, summer: 286, autumn: 320 },
  { hour: 22, label: "22:00", winter: 330, spring: 256, summer: 272, autumn: 300 },
  { hour: 23, label: "23:00", winter: 306, spring: 244, summer: 258, autumn: 278 },
];

export const seasons = [
  { key: "spring", label: "Spring",  color: "#15bc9d" },
  { key: "summer", label: "Summer",  color: "#ffc600" },
  { key: "autumn", label: "Autumn",  color: "#b904ca" },
{ key: "winter", label: "Winter",  color: "#5800FF" },
];