export const Avatar = ({ name, avatarUrl, bgColor = 'secondary-sky', size=24 }) => {
  
    function initials(name = "") {
        return name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase():'';
    }
    return (
    <div
      className={`flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-white bg-${bgColor} text-primitive-900 overflow-hidden`}
      aria-label={name}
      style={{width:size, height:size}}
      title={name}
    >
      {avatarUrl ? (
        <div className="w-full h-full bg-gray-200 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${avatarUrl})`, width:size, height:size}}></div>
      ) : (
        <span className={`text-[${(Number(size) * 0.45).toFixed(0)}px] font-heading`}>{initials(name)}</span>
      )}
    </div>
  );
}

export const AvatarStack = ({ people = [], peopleSize, size=24 }) => {

    const defaultSize = Number(peopleSize) > 0 ? peopleSize : people.length;


    const getDefaultList = (sizeLimit, size) => {
        let AvatarList = [];
        for (let index = 0; index < sizeLimit; index++) {
            AvatarList.push(<Avatar name={''} avatarUrl={''} size={size} />);
        }
        return AvatarList;
    }

  return (
    <div className="flex -space-x-2">
        {
            people.length>0?
                people.slice(0, 3).map((p, i) => (
                    <Avatar key={i} name={p?.name} avatarUrl={p?.avatarUrl} size={size} />
                ))
            :getDefaultList(defaultSize, size)
        }

      {}
    </div>
  );
}