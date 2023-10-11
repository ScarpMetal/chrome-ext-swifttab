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
  // Uncomment the code below when it's time to upgrade to extension manifest v3
  return `-webkit-image-set(
    url('chrome-extension://${
      chrome.runtime.id
    }/_favicon/?pageUrl=${encodeURIComponent(url)}&size=16') 1x,
    url('chrome-extension://${
      chrome.runtime.id
    }/_favicon/?pageUrl=${encodeURIComponent(url)}&size=32') 2x
  )`;

  // favicon URL scheme for Chrome manifest v2
  // return `-webkit-image-set(
  //     url('chrome://favicon/size/16@1x/${url}') 1x,
  //     url('chrome://favicon/size/16@2x/${url}') 2x
  //   )`;
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
          <div className="tile" key={folder.id}>
            <div className="card">
              <div className="card-title">{folder.title}</div>
              <ul className="bookmark-list">
                {folder.children
                  ?.filter(bookmark => bookmark.url)
                  .map(bookmark => (
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
              </ul>
            </div>
          </div>
        ))}
      </Masonry>
    </div>
  );
}

export default BookmarksView;
