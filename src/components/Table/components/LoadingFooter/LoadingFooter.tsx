import "./LoadingFooter.css"

interface LoadingFooterProps {
  loading: boolean
  hasData: boolean
}

const LoadingFooter = ({ loading, hasData }: LoadingFooterProps) => {
  if (!loading || !hasData) return null

  return (
    <div className="loading-container">
      <div className="loading-indicator">
        <div className="loading-spinner" />
        <strong>Loading more data...</strong>
      </div>
    </div>
  )
}

export default LoadingFooter
