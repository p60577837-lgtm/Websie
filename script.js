// Initialize Supabase
const _supabase = supabase.createClient(
    'https://wdoqyqllfqmggwxwmubs.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb3F5cWxsZnFtZ2d3eHdtdWJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1OTUyOTksImV4cCI6MjA4NjE3MTI5OX0.vKbO9Ge3bHbcgaJKJ6LYYuEu9yUBEkinMOfXPHwRzrY'
);

// 1. Submit Student to Registry
document.getElementById('submitBtn').addEventListener('click', async () => {
    const name = document.getElementById('name').value;
    const interest = document.getElementById('interest').value;

    if(!name || !interest) return alert("Please fill in both fields.");

    const { error } = await _supabase
        .from('students')
        .insert([{ name, interest }]);

    if (error) alert("Error: " + error.message);
    else {
        alert("Registered successfully!");
        document.getElementById('name').value = '';
        document.getElementById('interest').value = '';
    }
});

// 2. Fetch Comments/Reviews
async function fetchComments() {
    const { data, error } = await _supabase
        .from('comments')
        .select('*')
        .order('id', { ascending: false });

    const list = document.getElementById('comments-list');
    list.innerHTML = ''; 

    if (data) {
        data.forEach(comment => {
            const div = document.createElement('div');
            div.className = 'comment-card';
            div.innerHTML = `
                <div class="comment-content">
                    <b>${comment.student_name}</b>
                    <span>${comment.content}</span>
                </div>
                <div class="del-icon" onclick="deleteComment('${comment.id}')">Delete</div>
            `;
            list.appendChild(div);
        });
    }
}

// 3. Post a Review
document.getElementById('postRevBtn').addEventListener('click', async () => {
    const name = document.getElementById('rev-name').value;
    const content = document.getElementById('rev-content').value;

    if(!name || !content) return alert("Missing comment details!");

    const { error } = await _supabase
        .from('comments')
        .insert([{ student_name: name, content: content }]);

    if (!error) {
        document.getElementById('rev-content').value = '';
        fetchComments();
    }
});

// 4. Delete Comment
window.deleteComment = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this comment?");
    if (!confirmed) return;

    const { error } = await _supabase
        .from('comments')
        .delete()
        .eq('id', id);

    if (!error) fetchComments();
    else alert("Delete failed: " + error.message);
};

// Auto-load on startup
fetchComments();

