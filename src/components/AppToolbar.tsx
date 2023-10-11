import { FormEventHandler } from 'react';
import ToolbarIconButton from './ToolbarIconButton';

const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

function AppToolbar(props: {
  shadow?: boolean;
  handleSearchChange: FormEventHandler<HTMLInputElement>;
  searchValue: string;
}) {
  const { handleSearchChange, searchValue } = props;

  return (
    <div className="app-toolbar">
      <div className="app-title">SwiftTab</div>

      <div>
        <input
          autoComplete="off"
          autoFocus
          onInput={handleSearchChange}
          placeholder="Search"
          type="search"
          value={searchValue}
        />
      </div>

      <div>
        {!isFirefox && (
          <>
            <ToolbarIconButton
              icon="star"
              title="Bookmarks"
              url="chrome://bookmarks/"
            />
            <ToolbarIconButton
              icon="history"
              title="History"
              url="chrome://history"
            />
            <ToolbarIconButton
              icon="file_download"
              title="Downloads"
              url="chrome://downloads/"
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AppToolbar;
