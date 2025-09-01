import SelectInitialFolder from "./pages/select-initial-folder/select-initial-folder"
import { If } from "./components/if"
import usePathStore from "./stores/path.store"
import { Scanner } from "./pages/scanner/scanner"

function App() {
  // const [count, setCount] = React.useState(0)
  const pathStore = usePathStore()
  const hasPath = pathStore.path.length > 0

  return (
    <div className="min-h-screen bg-white">
        <If condition={!hasPath}>
          <SelectInitialFolder/>
        </If>
        <If condition={hasPath}>
          <Scanner />
        </If>        
    </div>
  )
}

export default App
