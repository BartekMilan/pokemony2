import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

type PikachuProps = {
  size?: number;
};

export function Pikachu({ size = 72 }: PikachuProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 256 256">
      <Ellipse cx="128" cy="168" rx="72" ry="64" fill="#F5D020" />
      <Path
        d="M72 108 L48 32 L96 88 Z"
        fill="#F5D020"
        stroke="#2A2A2A"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <Path
        d="M184 108 L208 32 L160 88 Z"
        fill="#F5D020"
        stroke="#2A2A2A"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <Path d="M48 32 L56 56 L72 48 Z" fill="#2A2A2A" />
      <Path d="M208 32 L200 56 L184 48 Z" fill="#2A2A2A" />
      <Ellipse cx="128" cy="132" rx="68" ry="60" fill="#F5D020" />
      <Ellipse cx="128" cy="148" rx="52" ry="44" fill="#FFF8DC" />
      <Circle cx="98" cy="124" r="10" fill="#2A2A2A" />
      <Circle cx="158" cy="124" r="10" fill="#2A2A2A" />
      <Circle cx="101" cy="121" r="3" fill="#FFF" />
      <Circle cx="161" cy="121" r="3" fill="#FFF" />
      <Ellipse cx="78" cy="142" rx="14" ry="10" fill="#E3350D" opacity="0.85" />
      <Ellipse cx="178" cy="142" rx="14" ry="10" fill="#E3350D" opacity="0.85" />
      <Path
        d="M118 152 Q128 162 138 152"
        fill="none"
        stroke="#2A2A2A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Path d="M128 152 L128 158" stroke="#2A2A2A" strokeWidth="2" />
      <Path
        d="M96 168 Q128 188 160 168"
        fill="none"
        stroke="#2A2A2A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Ellipse cx="108" cy="208" rx="18" ry="10" fill="#F5D020" />
      <Ellipse cx="148" cy="208" rx="18" ry="10" fill="#F5D020" />
    </Svg>
  );
}
