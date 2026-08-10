import { PlatformIcon } from './SocialProductTile.jsx'

export default function SocialBrandIcon({ platform = '', mono = false, size = 20, className = '' }) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <PlatformIcon platform={platform} size={size} />
    </div>
  )
}

