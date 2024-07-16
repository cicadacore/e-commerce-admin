import { MagnifyingGlass, Blocks } from 'react-loader-spinner';
import './progressBar.css';

interface LoaderProp {
  type?: string;
}
const LoaderNew: React.FC<LoaderProp> = () => {
  return (
    <div className="overrelay">
      <Blocks
        visible
        height="40"
        width="40"
        color="red"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
      />
    </div>
  );
};

export default LoaderNew;
