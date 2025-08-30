import { SearchIcon } from "@/components/Table/Icons"
import "@/components/Table/components/BlankSlate/BlankSlate.css"

interface BlankSlateProps {
  text: string
}

const BlankSlate = ({ text }: BlankSlateProps) => (
  <div className="blank-slate">
    <SearchIcon />
    <h3 className="blank-slate-text">{text}</h3>
  </div>
)

export default BlankSlate
