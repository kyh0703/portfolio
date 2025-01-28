export function Play() {
  return (
    <>
      <path
        d="M5 14C5 13.4477 5.44772 13 6 13H11V27H6C5.44772 27 5 26.5523 5 26V14Z"
        fill="#405189"
      />
      <path d="M11 13L21 6V34L11 27V13Z" fill="#5F6EA0" />
      <path
        d="M21 6L22.4453 5.03647C23.1099 4.59343 24 5.06982 24 5.86852V34.1315C24 34.9302 23.1099 35.4066 22.4453 34.9635L21 34V6Z"
        fill="#5F6EA0"
      />
      <mask
        id="mask0_1840_92847"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="27"
        y="5"
        width="10"
        height="30"
      >
        <rect x="27" y="5" width="10" height="30" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_1840_92847)">
        <circle
          opacity="0.6"
          cx="24"
          cy="20"
          r="10"
          stroke="#3C95EF"
          strokeWidth="2"
        />
        <circle
          opacity="0.9"
          cx="25"
          cy="20"
          r="4"
          stroke="#3C95EF"
          strokeWidth="2"
        />
      </g>
    </>
  )
}
