module.exports = (username, status, message) => {
  const statusColors = {
    approved: { bg: "#198754", color: "#d1e7dd" },
    rejected: { bg: "#dc3545", color: "#f8d7da" },
    pending: { bg: "#fd7e14", color: "#fff3cd" },
  };

  const statusConfig = statusColors[status] || statusColors.pending;
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);

  return `
<div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <!-- Import Google Font -->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
  </style>
  
  <div style="background: linear-gradient(135deg, ${statusConfig.bg} 0%, ${
    statusConfig.bg
  }dd 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <!-- Elegant Joya Text - Matching the brand style -->
    <h1 style="color: white; margin: 0; font-family: 'Dancing Script', cursive; font-weight: 600; font-size: 48px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); letter-spacing: 2px;">Joya</h1>
    <p style="color: white; margin: 10px 0 0 0; font-weight: 500;">Host Application Update</p>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; margin-bottom: 20px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-weight: 600;">Hello ${username}!</h2>
    
    <p style="color: #666; line-height: 1.6; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      We have an update regarding your host application on Joya Platform.
    </p>
    
    <div style="background: ${
      statusConfig.color
    }; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid ${
    statusConfig.bg
  };">
      <h3 style="color: ${
        statusConfig.bg
      }; margin-top: 0;">Application Status: ${statusText}</h3>
      <p style="color: #666; margin: 10px 0 0 0; line-height: 1.6;">${message}</p>
    </div>
    
    ${
      status === "approved"
        ? `
    <p style="color: #666; line-height: 1.6;">
      Congratulations! You can now start listing your properties on Joya. Visit your host dashboard to get started.
    </p>
    `
        : status === "rejected"
        ? `
    <p style="color: #666; line-height: 1.6;">
      Don't worry! You can review the feedback and reapply once you've addressed the concerns mentioned above.
    </p>
    `
        : `
    <p style="color: #666; line-height: 1.6;">
      We'll notify you as soon as there's an update on your application. Thank you for your patience!
    </p>
    `
    }
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      <p style="color: #999; font-size: 12px; margin: 0;">
        This is an automated email from Joya Platform. Please do not reply to this email.
      </p>
    </div>
  </div>
</div>
`;
};
