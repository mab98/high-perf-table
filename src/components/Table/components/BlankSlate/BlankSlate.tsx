import searchIcon from "../../../../assets/search-icon.svg"
import "./BlankSlate.css"

interface BlankSlateProps {
  text: string
}

const BlankSlate = ({ text }: BlankSlateProps) => (
  <div className="blank-slate">
    <img src={searchIcon} alt="Search" width="64" height="64" />
    <h3 className="blank-slate-text">{text}</h3>
  </div>
)

export default BlankSlate
