import { UIEventHandler } from 'react';
import Masonry, { MasonryOptions } from 'react-masonry-component';

const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

const masonryOptions: MasonryOptions = {
  transitionDuration: 200,
};

function getImageString(url: string) {
  if (isFirefox) {
    // favicon URL scheme for Firefox
    const urlObj = new URL(url);
    const origin = urlObj.origin;
    return `url("https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${origin}&size=32")`;
  }

  // chrome-extension://<id>/_favicon/?pageUrl=https://example.com&size=24
  return `-webkit-image-set(
    url('chrome-extension://${
      chrome.runtime.id
    }/_favicon/?pageUrl=${encodeURIComponent(url)}&size=16') 1x,
    url('chrome-extension://${
      chrome.runtime.id
    }/_favicon/?pageUrl=${encodeURIComponent(url)}&size=32') 2x
  )`;
}

function BookmarksView(props: {
  data: chrome.bookmarks.BookmarkTreeNode[];
  handleScrollChange: UIEventHandler<HTMLDivElement>;
}) {
  const { data: bookmarks, handleScrollChange } = props;

  return (
    <div className="bookmarks-view" onScroll={handleScrollChange}>
      <Masonry className="bookmarks" options={masonryOptions}>
        {bookmarks.map(folder => (
          <RenderFolder key={folder.id} folder={folder} />
        ))}
      </Masonry>
    </div>
  );
}

function RenderFolder({
  folder,
  nestedLevel = 0,
}: {
  folder: chrome.bookmarks.BookmarkTreeNode;
  nestedLevel?: number;
}) {
  return (
    <div className={nestedLevel > 0 ? 'nested-tile' : 'tile'}>
      <div className="card">
        <div className="card-title">{folder.title}</div>
        <RenderFolderChildren
          folderChildren={folder.children}
          nestedLevel={nestedLevel}
        />
      </div>
    </div>
  );
}

function RenderFolderChildren({
  folderChildren,
  nestedLevel,
}: {
  folderChildren?: chrome.bookmarks.BookmarkTreeNode[];
  nestedLevel: number;
}) {
  if (!folderChildren) return null;

  const bookmarks = folderChildren.filter(bookmark => !!bookmark.url);
  const folders = folderChildren.filter(bookmark => !!bookmark.children);

  return (
    <ul className="bookmark-list">
      {bookmarks.map(bookmark => (
        <li key={bookmark.id}>
          <a
            href={bookmark.url}
            title={bookmark.title}
            style={{
              backgroundImage: getImageString(bookmark.url!),
            }}
          >
            {bookmark.title}
          </a>
        </li>
      ))}
      {folders.map(folder => (
        <RenderFolder
          key={folder.id}
          folder={folder}
          nestedLevel={nestedLevel + 1}
        />
      ))}
    </ul>
  );
}

export default BookmarksView;
