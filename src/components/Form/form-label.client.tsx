"use client";

type Props = {
  label: string;
  required?: boolean;
};

const FormLabel: React.FC<Props> = ({ label, required }) => {
  return (
    <div
      className="mb-1 flex items-center
    0"
    >
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        width={8}
        color="red"
        fill="#3b82f6"
        className="mr-2"
      >
        <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
      </svg> */}
      <label>
        {label}
        {!required && (
          <span className="ml-1 text-xs italic text-gray-600">*Opcional</span>
        )}
      </label>
    </div>
  );
};

export default FormLabel;
