import { useNavigate } from "react-router";
import { format } from "date-fns";
import { useGetMedia } from "hooks/MediaHooks/MediaHooks";

const MediaTable = () => {
  const navigate = useNavigate();
  const { media } = useGetMedia();
  return (
    <table>
      <thead>
        <tr>
          <th>Media</th>
        </tr>
      </thead>
      <tbody>
        {media.map((item) => (
          <tr
            key={item.mediaId}
            onClick={() => navigate(`/media/${item.mediaId}`)}
            data-clickable
          >
            <td>{item.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MediaTable;