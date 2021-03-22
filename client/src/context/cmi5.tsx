/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import Cmi5 from "@xapi/cmi5";

type ContextType = {
  cmi5: Cmi5 | undefined;
};

const Cmi5Context = React.createContext<ContextType>({
  cmi5: undefined,
});

function Cmi5Provider(props: { children: any }) {
  const [cmi5, setCmi5] = React.useState<Cmi5>();

  React.useEffect(() => {
    if (Cmi5.isCmiAvailable) {
      const cmi: Cmi5 = new Cmi5();
      cmi.initialize();
      setCmi5(cmi);
    }
  }, []);

  return (
    <Cmi5Context.Provider
      value={{
        cmi5,
      }}
    >
      {props.children}
    </Cmi5Context.Provider>
  );
}

export default Cmi5Context;
export { Cmi5Provider };
