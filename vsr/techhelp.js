// Inside checkAuth()
async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const authSection = document.getElementById('auth-section');
    const addressField = document.getElementById('auth-address-field');

    if (session) {
        isUserSignedIn = true;
        authSection.style.display = 'block';
        addressField.style.display = 'block'; // Show address field next to phone

        const { data } = await supabaseClient.from('citizens').select('full_name').eq('auth_id', session.user.id).single();
        if (data) document.getElementById('f-name').value = data.full_name;
        document.getElementById('f-email').value = session.user.email;
        document.getElementById('f-email').disabled = true;
    }
}
