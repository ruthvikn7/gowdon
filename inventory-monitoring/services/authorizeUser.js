export const authorize = (role) => {
    return (req, res, next) => {
      // Check if any role in req.user.role matches any role in the role array
      const isAuthorized = req.user.role.some((userRole) =>
        role.includes(userRole)
      );
      if (!isAuthorized) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      next();
    };
  };
  
  // ROLE_CANDIDATE;
  
  // ROLE_DEVELOPERS;
  // ROLE_MANAGER;
  // ROLE_TECHLEAD;
  // ROLE_EMPLOYEE;
  // ROLE_SUPER_ADMIN;
  // ROLE_ADMIN;
  